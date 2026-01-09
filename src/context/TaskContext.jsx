// src/context/TaskContext.js
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as firebaseTasks from '../api/firebaseTasks';
import { addTaskToFirestore, deleteTaskFromFirestore, updateTask as apiUpdateTask } from '../api/firebaseTasks';
import { useAuth } from './AuthContext';

export const TaskContext = createContext();

const initialState = {
  assignedTasks: [],
  availableTasks: [],
  allFamilyTasks: [],
  weeklyAssignments: {},
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, ...action.payload, loading: false, error: null };
    case 'ASSIGN_WEEKLY': {
      const { task, days, timeSlot } = action.payload;
      const next = { ...state.weeklyAssignments };

      days.forEach(day => {
        const daySlots = next[day] ? { ...next[day] } : {};
        const updated = [
          ... (daySlots[timeSlot] || []),
          task
        ];
        daySlots[timeSlot] = updated;
        next[day] = daySlots;
      });

      return { ...state, weeklyAssignments: next };
    }

    // NEW: remove a single task from a specific day/time
    case 'UNASSIGN_WEEKLY': {
      const { taskId, day, timeSlot } = action.payload;
      const next = { ...state.weeklyAssignments };
      if (!next[day]?.[timeSlot]) return state;

      const filtered = next[day][timeSlot].filter(t => t.id !== taskId);
      next[day] = { ...next[day], [timeSlot]: filtered };
      return { ...state, weeklyAssignments: next };
    }

    // NEW: remove a task from _all_ day/time slots (e.g. on delete)
    case 'CLEAR_WEEKLY_FOR_TASK': {
      const { taskId } = action.payload;
      const next = {};

      for (const [day, slots] of Object.entries(state.weeklyAssignments)) {
        const newSlots = {};
        for (const [ts, tasks] of Object.entries(slots)) {
          const kept = tasks.filter(t => t.id !== taskId);
          if (kept.length) newSlots[ts] = kept;
        }
        if (Object.keys(newSlots).length) next[day] = newSlots;
      }

      return { ...state, weeklyAssignments: next };
    }
    case 'LOADING':
      return { ...state, loading: true };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  
  const fetchTasks = useCallback(async () => {
    if (!user?.token || !user?.familyId || !user?.uid) return;

    dispatch({ type: 'LOADING' });
    try {
      const [allTasks, myTasks] = await Promise.all([
        firebaseTasks.getTasksForFamily(user.familyId, user.token),
        firebaseTasks.getTasksForChild(user.uid, user.familyId, user.token)
      ]);

      const assignedIds = new Set(myTasks.map((t) => t.id));
      const unassigned = allTasks.filter((t) => !assignedIds.has(t.id));

      dispatch({
        type: 'SET_TASKS',
        payload: {
          assignedTasks: myTasks,
          availableTasks: unassigned,
          allFamilyTasks: allTasks,
        },
      });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      dispatch({ type: 'ERROR', payload: 'Failed to load tasks' });
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

   const addTask = async (task) => {
    try{
      await addTaskToFirestore(task, user.token);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to add new task: ', err)
    }
    
  };

  const deleteTask = async (taskId) => {
    try{
      await deleteTaskFromFirestore(taskId, user.token);
      dispatch({ type: 'CLEAR_WEEKLY_FOR_TASK', payload: { taskId } });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task: ', err);
    }
  };

  const reassignTask = async (taskId, newAssignedTo) => {
    try {
      await firebaseTasks.updateTaskAssignment(taskId, newAssignedTo, user.token);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update assignment:', err);
    }
  };

  const reassignTaskOptimistic = async (taskId, newAssignedTo, moveInfo) => {
    // 1. Optimistically update UI
    dispatch({
      type: 'SET_TASKS',
      payload: {
        assignedTasks: moveInfo.newAssigned,
        availableTasks: moveInfo.newAvailable,
        allFamilyTasks: [...moveInfo.newAssigned, ...moveInfo.newAvailable],
      },
    });

    // 2. Firestore update in background
    try {
      await firebaseTasks.updateTaskAssignment(taskId, newAssignedTo, user.token);
    } catch (err) {
      console.error('Failed to update assignment:', err);
      // Optionally revert or refetch
      fetchTasks();
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    dispatch({ type: 'LOADING' });
    try {
      await apiUpdateTask(taskId, updatedFields, user.token);
      await fetchTasks();
      dispatch({ type: 'LOADING', payload: false });
    } catch (err) {
      console.error('Task update failed:', err);
      dispatch({ type: 'ERROR', payload: 'Failed to update task' });
      throw err;
    }
  };

  const assignWeekly = (task, days, timeSlot) => {
    dispatch({ type: 'ASSIGN_WEEKLY', payload: { task, days, timeSlot } });
    // TODO: persist via firebaseTasks if needed
  };

  const unassignWeekly = (taskId, day, timeSlot) => {
    dispatch({ type: 'UNASSIGN_WEEKLY', payload: { taskId, day, timeSlot } });
    // TODO: persist removal via API
  };

  const value = {
    ...state,
    refreshTasks: fetchTasks,
    reassignTask,
    reassignTaskOptimistic,
    addTask,
    deleteTask,
    updateTask,
    assignWeekly,
    unassignWeekly,

  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => useContext(TaskContext);
