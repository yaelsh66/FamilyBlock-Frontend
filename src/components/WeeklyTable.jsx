import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';
import { getKidsByFamily } from '../api/firebaseTasks';
import { WEEK_DAY_NAMES } from '../api/weeklyApi';
import TaskItem from './TaskItem';
import WeekDayPicker from './WeekDayPicker';
import './WeeklyTable.css';

const WEEK_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Distinct colors for different children's tasks */
const CHILD_COLORS = [
  { bg: '#e3f2fd', border: '#90caf9' },   /* light blue */
  { bg: '#f3e5f5', border: '#ce93d8' },   /* light purple */
  { bg: '#e8f5e9', border: '#81c784' },   /* light green */
  { bg: '#fff3e0', border: '#ffb74d' },   /* light orange */
  { bg: '#fce4ec', border: '#f48fb1' },   /* light pink */
  { bg: '#e0f7fa', border: '#4dd0e1' },   /* light cyan */
  { bg: '#f1f8e9', border: '#aed581' },   /* light lime */
  { bg: '#fff8e1', border: '#ffca28' },   /* light amber */
];

function getChildIdFromTask(task) {
  return task?.familyMemberId ?? task?.childId ?? task?.family_member_id ?? task?.userId ?? task?.user_id;
}

export default function WeeklyTable({ selectedChildId: selectedChildIdProp = null }) {
  const { user } = useAuth();
  const {
    allFamilyTasks: tasks,
    weeklyAssignments,
    assignWeekly,
    updateWeekly,
    unassignWeekly,
    refreshTasks,
  } = useTaskContext();

  // When used on /week: parent can pick a child; child uses own id
  const [children, setChildren] = useState([]);
  const [parentSelectedChildId, setParentSelectedChildId] = useState('');
  const selectedChildId = selectedChildIdProp != null
    ? selectedChildIdProp
    : user?.role === 'CHILD'
      ? (user?.id ?? user?.uid)
      : parentSelectedChildId || null;

  useEffect(() => {
    if (selectedChildId != null) {
      refreshTasks(selectedChildId);
    } else if (user?.role === 'PARENT') {
      refreshTasks(null);
    }
  }, [selectedChildId, user?.role, refreshTasks]);

  useEffect(() => {
    if (user?.role === 'PARENT' && user?.familyId && user?.token) {
      getKidsByFamily(user.familyId, user.token)
        .then(setChildren)
        .catch((e) => console.error('Failed to load children', e));
    }
  }, [user?.role, user?.familyId, user?.token]);

  // which task is currently assigning
  const [pickerTaskId, setPickerTaskId] = useState(null);
  const [editingWeeklyTask, setEditingWeeklyTask] = useState(null);

  const getChildIdForTask = (task) =>
    selectedChildId ||
    (task?.childId ??
      task?.familyMemberId ??
      task?.family_member_id ??
      task?.userId ??
      task?.user_id);

  const initialDaysForTask = (task) => {
    const days = task?.days;
    if (!Array.isArray(days)) return [];
    return days.map((d) => WEEK_DAY_NAMES.indexOf(d)).filter((i) => i >= 0);
  };
  const initialTimeForTask = (task) => {
    const t = task?.localTime ?? task?.toDoAt;
    if (t == null) return '09:00';
    const s = String(t);
    return s.length >= 5 ? s.substring(0, 5) : s;
  };

  const timeSlotsSorted = useMemo(() => {
    const set = new Set();
    for (let d = 0; d <= 6; d++) {
      const slots = weeklyAssignments[d] || {};
      Object.keys(slots).forEach((t) => set.add(t));
    }
    return Array.from(set).sort();
  }, [weeklyAssignments]);

  const childColorMap = useMemo(() => {
    const map = new Map();
    const childIds = new Set();
    children.forEach((c) => childIds.add(String(c.id)));
    for (let d = 0; d <= 6; d++) {
      const slots = weeklyAssignments[d] || {};
      for (const taskList of Object.values(slots)) {
        for (const t of taskList) {
          const cid = getChildIdFromTask(t);
          if (cid != null) childIds.add(String(cid));
        }
      }
    }
    const ordered = [...childIds].sort();
    ordered.forEach((id, i) => {
      const c = CHILD_COLORS[i % CHILD_COLORS.length];
      map.set(id, c);
    });
    return map;
  }, [children, weeklyAssignments]);

  const getTaskStyle = (task) => {
    const cid = getChildIdFromTask(task) ?? selectedChildId;
    if (!cid) return {};
    const c = childColorMap.get(String(cid));
    if (!c) return {};
    return { backgroundColor: c.bg, borderLeft: `3px solid ${c.border}` };
  };

  const hasMultipleChildren = childColorMap.size > 1;

  return (
    <Container fluid className="weekly-table-page">
      <h1 className="page-title">Weekly schedule</h1>

      {user?.role === 'PARENT' && selectedChildIdProp == null && (
        <Form.Group className="mb-3">
          <Form.Label>Assign schedule for</Form.Label>
          <Form.Select
            value={parentSelectedChildId}
            onChange={(e) => setParentSelectedChildId(e.target.value)}
          >
            <option value="">-- Select a child --</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.nickname || child.email || child.id}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {hasMultipleChildren && user?.role === 'PARENT' && (
        <div className="weekly-child-legend mb-3">
          {children.map((child) => {
            const c = childColorMap.get(String(child.id));
            if (!c) return null;
            return (
              <span key={child.id} className="weekly-legend-item">
                <span className="weekly-legend-dot" style={{ backgroundColor: c.border }} />
                {child.nickname || child.email || child.id}
              </span>
            );
          })}
        </div>
      )}

      {editingWeeklyTask && (
        <div className="weekly-table-update-panel">
          <div className="update-panel-title">Update days & time: {editingWeeklyTask.title}</div>
          <WeekDayPicker
            key={editingWeeklyTask.id}
            initialSelectedDays={initialDaysForTask(editingWeeklyTask)}
            initialSelectedTime={initialTimeForTask(editingWeeklyTask)}
            onDone={(days, time) => {
              const childId = getChildIdForTask(editingWeeklyTask);
              updateWeekly(editingWeeklyTask.id, days, time, childId);
              setEditingWeeklyTask(null);
            }}
            onCancel={() => setEditingWeeklyTask(null)}
          />
        </div>
      )}

      <div className="weekly-layout-row">
        <div className="weekly-table-wrapper">
          <Table bordered className="weekly-schedule-table">
          <thead>
            <tr>
              <th className="weekly-table-time-col">Time</th>
              {WEEK_DAY_LABELS.map((label, idx) => (
                <th key={idx} className="weekly-table-day-col">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlotsSorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No scheduled tasks yet. Assign days to tasks on the right.
                </td>
              </tr>
            ) : (
              timeSlotsSorted.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="weekly-table-time-col">{timeSlot}</td>
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                    const dayTasks = (weeklyAssignments[dayIdx] || {})[timeSlot] || [];
                    return (
                      <td key={dayIdx} className="weekly-table-day-col weekly-table-cell">
                        {dayTasks.map((t, i) => (
                          <div
                            key={`${dayIdx}-${timeSlot}-${t.id}-${i}`}
                            className="weekly-table-cell-task"
                            style={getTaskStyle(t)}
                          >
                            <TaskItem task={t} />
                            <div className="d-flex gap-1 mt-1 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => setEditingWeeklyTask(t)}
                              >
                                Update
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => {
                                  const childId = getChildIdForTask(t);
                                  unassignWeekly(t, dayIdx, timeSlot, childId);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
          </Table>
        </div>

        <aside className="weekly-table-tasks-section">
        <h5 className="weekly-table-tasks-title">Your tasks</h5>
        <div className="weekly-table-tasks-list-horizontal">
          {tasks.map((task, index) => (
            <div key={`task-${task.id}-${index}`} className="weekly-table-task-card d-flex flex-column">
              {pickerTaskId === task.id && (
                <div className="mb-2">
                  <WeekDayPicker
                    onDone={(days, time) => {
                      assignWeekly(task, days, time, selectedChildId);
                      setPickerTaskId(null);
                    }}
                    onCancel={() => setPickerTaskId(null)}
                  />
                </div>
              )}
              <TaskItem task={task} />
              <div className="mt-2">
                <Button
                  size="sm"
                  disabled={!selectedChildId}
                  onClick={() => setPickerTaskId(task.id)}
                  title={!selectedChildId ? 'Select a child first' : undefined}
                >
                  Assign Days
                </Button>
              </div>
            </div>
          ))}
        </div>
        </aside>
      </div>
    </Container>
  );
}
