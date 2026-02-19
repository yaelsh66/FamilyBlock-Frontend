// src/context/TaskContext.js
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as firebaseTasks from '../api/firebaseTasks';
import { addTaskToBackend, deleteTaskBackend, updateTask as apiUpdateTask } from '../api/firebaseTasks';
import * as weeklyApi from '../api/weeklyApi';
import { useAuth } from './AuthContext';

const { WEEK_DAY_NAMES } = weeklyApi;

/** Build weeklyAssignments from API tasks. API DTO: id, taskTemplateId, familyMemberId, title, description, minutesReward, days, toDoAt/localTime, wasCompleteToday. Preserves all fields. */
function buildWeeklyAssignments(tasksWithWeekly) {
  const next = {};
  if (!Array.isArray(tasksWithWeekly)) return next;
  for (const task of tasksWithWeekly) {
    const days = task.days;
    const localTime = task.localTime ?? (task.toDoAt ? String(task.toDoAt).substring(0, 5) : null);
    if (!Array.isArray(days) || !localTime) continue;
    for (const dayName of days) {
      const dayIndex = WEEK_DAY_NAMES.indexOf(dayName);
      if (dayIndex === -1) continue;
      if (!next[dayIndex]) next[dayIndex] = {};
      if (!next[dayIndex][localTime]) next[dayIndex][localTime] = [];
      next[dayIndex][localTime].push(task);
    }
  }
  return next;
}

/** Normalize weeklySchedule from API: if keys are day names, convert to numeric 0-6. */
function normalizeWeeklySchedule(schedule) {
  if (!schedule || typeof schedule !== 'object') return {};
  const next = {};
  for (const [key, slots] of Object.entries(schedule)) {
    const dayIndex = WEEK_DAY_NAMES.includes(key) ? WEEK_DAY_NAMES.indexOf(key) : Number(key);
    if (Number.isInteger(dayIndex) && dayIndex >= 0 && dayIndex <= 6) {
      next[dayIndex] = slots;
    }
  }
  return next;
}

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

  
  const fetchTasks = useCallback(async (childId = null) => {
    if (!user?.token || !user?.familyId || !user?.uid) {
      console.log("❌ fetchTasks aborted due to missing user fields");
      return;
    }

    dispatch({ type: 'LOADING' });
    try {
      const weeklyPromise = user?.role === 'CHILD'
        ? weeklyApi.getChildWeeklySchedule(user.token)
        : weeklyApi.getWeeklySchedule(user.token, childId ?? undefined);

      const [allTasks, myTasks, weeklyData] = await Promise.all([
        firebaseTasks.getTasksForFamily(user.token),
        firebaseTasks.getTasksForChild(user.token),
        weeklyPromise.catch(() => []),
      ]);
      console.log("allTasks", allTasks);
      console.log("myTasks", myTasks);

      let weeklyAssignments;
      if (weeklyData?.weeklySchedule && typeof weeklyData.weeklySchedule === 'object') {
        weeklyAssignments = normalizeWeeklySchedule(weeklyData.weeklySchedule);
      } else if (Array.isArray(weeklyData)) {
        weeklyAssignments = buildWeeklyAssignments(weeklyData);
      } else if (Array.isArray(weeklyData?.familyTasksList)) {
        weeklyAssignments = buildWeeklyAssignments(weeklyData.familyTasksList);
      } else if (weeklyData && typeof weeklyData === 'object' && !Array.isArray(weeklyData)) {
        weeklyAssignments = normalizeWeeklySchedule(weeklyData);
      } else {
        weeklyAssignments = {};
      }

      dispatch({
        type: 'SET_TASKS',
        payload: {
          assignedTasks: myTasks,
          availableTasks: allTasks,
          allFamilyTasks: allTasks,
          weeklyAssignments,
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
      await addTaskToBackend(task, user.token);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to add new task: ', err)
    }
    
  };

  const deleteTask = async (taskId, childId = null) => {
    try{
      await deleteTaskBackend(taskId, user.token);
      await weeklyApi.clearTaskWeeklySchedule(taskId, user.token, childId ?? undefined).catch(() => {});
      dispatch({ type: 'CLEAR_WEEKLY_FOR_TASK', payload: { taskId } });
      await fetchTasks(childId);
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
    

    // 2. Firestore update in background

    try {
      await firebaseTasks.updateTaskAssignment(taskId, newAssignedTo, user.token);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update assignment:', err);
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

  const assignWeekly = async (task, days, timeSlot, childId) => {
    const dayIndices = Array.isArray(days) ? days : (days != null ? [days] : []);
    dispatch({ type: 'ASSIGN_WEEKLY', payload: { task, days: dayIndices, timeSlot } });
    if (childId == null || childId === '') return;
    const daysSameAsDaily = dayIndices.map((i) => WEEK_DAY_NAMES[Number(i)]).filter(Boolean);
    if (daysSameAsDaily.length === 0) return;
    try {
      await weeklyApi.assignTaskWeekly(task.id, childId, daysSameAsDaily, timeSlot, user.token);
      await fetchTasks(childId);
    } catch (err) {
      console.error('Failed to persist weekly assignment:', err);
      dispatch({ type: 'CLEAR_WEEKLY_FOR_TASK', payload: { taskId: task.id } });
    }
  };

  const unassignWeekly = async (task, day, timeSlot, childId) => {
    const taskId = task?.id;
    if (taskId == null) return;
    dispatch({ type: 'CLEAR_WEEKLY_FOR_TASK', payload: { taskId } });
    if (childId == null) return;
    try {
      await weeklyApi.clearTaskWeeklySchedule(taskId, user.token, childId ?? undefined);
      await fetchTasks(childId);
    } catch (err) {
      console.error('Failed to persist weekly unassign:', err);
      fetchTasks(childId);
    }
  };

  const updateWeekly = async (weeklyScheduleId, days, timeSlot, childId) => {
    const dayIndices = Array.isArray(days) ? days : (days != null ? [days] : []);
    const daysSameAsDaily = dayIndices.map((i) => WEEK_DAY_NAMES[Number(i)]).filter(Boolean);
    if (daysSameAsDaily.length === 0) return;
    try {
      await weeklyApi.updateWeeklyTask(
        weeklyScheduleId,
        { days: daysSameAsDaily, toDoAt: timeSlot ?? '09:00' },
        user.token,
        childId ?? undefined
      );
      await fetchTasks(childId);
    } catch (err) {
      console.error('Failed to update weekly schedule:', err);
      if (childId != null) fetchTasks(childId);
    }
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
    updateWeekly,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => useContext(TaskContext);
