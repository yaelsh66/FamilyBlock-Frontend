// src/api/weeklyApi.js
// API for weekly task schedule. Uses same variable types as daily time:
// days = array of day name strings ('SUNDAY', 'MONDAY', ...), localTime = "HH:mm".

import axios from 'axios';

const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/weekly`;

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

/** Day names in same order as time_control / daily time (Sunday = 0). */
export const WEEK_DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

/**
 * GET weekly schedule for the family (parent view).
 * Optional childId: when provided, returns only that child's weekly schedule; when omitted, returns all children (parent can filter in UI).
 *
 * Backend DTO per item: id, taskTemplateId, familyMemberId, title, description, minutesReward,
 *   days (List<String>), toDoAt (LocalTime "HH:mm"), wasCompleteToday (Boolean).
 * All fields are preserved. toDoAt is also exposed as localTime for compatibility.
 */
export const getWeeklySchedule = async (idToken, childId = null) => {
  const url = `${BACKEND_BASE_URL}/family_weekly_schedule`;
  try {
    const res = await axios.get(url, {
      headers: authHeader(idToken),
      params: childId != null ? { childId } : {},
    });
    const raw = res.data?.familyTasksList ?? res.data?.weeklySchedule ?? res.data;
    if (Array.isArray(raw)) return raw.map(normalizeWeeklyTask);
    if (raw && typeof raw === 'object') return raw;
    return [];
  } catch (error) {
    console.error('❌ Failed to fetch weekly schedule:', error.message);
    throw error;
  }
};

/** Normalize API DTO: ensure localTime from toDoAt, preserve all fields. */
function normalizeWeeklyTask(item) {
  if (!item || typeof item !== 'object') return item;
  const t = { ...item };
  if (t.toDoAt != null && t.localTime == null) t.localTime = formatTime(t.toDoAt);
  return t;
}

function formatTime(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v.length >= 5 ? v.substring(0, 5) : v;
  return String(v);
}

/**
 * Assign a task to a child for the given weekdays and time.
 * Same variable types as daily: days = array of day name strings, localTime = "HH:mm".
 *
 * Expected response: {
 *   success?: boolean,
 *   task?: { id, title, description, screenTime, days, localTime, ... }
 * }
 */
export const assignTaskWeekly = async (taskId, childId, days, localTime, idToken) => {
  const url = `${BACKEND_BASE_URL}/assign_weekly`;
  const payload = {
    taskId,
    childId,
    days,       // string[] 'SUNDAY','MONDAY',... same as daily time days
    localTime,  // "HH:mm" same as schedule start/end time format
  };
  try {
    const res = await axios.post(url, payload, {
      headers: {
        ...authHeader(idToken),
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.error('❌ Failed to assign task weekly:', error.message);
    throw error;
  }
};

/**
 * Update a weekly schedule item. Sends new days and time.
 * weeklyScheduleId: Long id of the weekly schedule entry.
 * days: string[] - e.g. ['MONDAY','WEDNESDAY']
 * toDoAt: string - "HH:mm" e.g. "09:00"
 * childId: optional - when parent updates for a specific child.
 *
 * Expected response: updated task object or { success?: boolean }.
 */
export const updateWeeklyTask = async (weeklyScheduleId, { days, toDoAt }, idToken, childId = null) => {
  const url = `${BACKEND_BASE_URL}/update`;
  const payload = { id: weeklyScheduleId, days, toDoAt };
  try {
    const res = await axios.put(url, payload, {
      headers: {
        ...authHeader(idToken),
        'Content-Type': 'application/json',
      },
      params: childId != null ? { childId } : {},
    });
    const data = res.data;
    return data?.task != null ? normalizeWeeklyTask(data.task) : data;
  } catch (error) {
    console.error('❌ Failed to update weekly task:', error.message);
    throw error;
  }
};

/**
 * Mark a weekly schedule task as complete (today).
 * weeklyScheduleId: Long id of the weekly schedule entry.
 * childId: optional - when parent completes for a specific child.
 * comment: optional - child's comment when completing the task.
 *
 * Expected response: updated task object with wasCompleteToday: true, or { success?: boolean }.
 */
export const completeWeeklyTask = async (weeklyScheduleId, idToken, childId = null, comment = null) => {
  const url = `${BACKEND_BASE_URL}/complete`;
  try {
    const body = { id: weeklyScheduleId };
    if (comment != null && String(comment).trim() !== '') {
      body.comment = String(comment).trim();
    }
    const res = await axios.post(url, body, {
      headers: {
        ...authHeader(idToken),
        'Content-Type': 'application/json',
      },
      params: childId != null ? { childId } : {},
    });
    const data = res.data;
    return data?.task != null ? normalizeWeeklyTask(data.task) : data;
  } catch (error) {
    console.error('❌ Failed to complete weekly task:', error.message);
    throw error;
  }
};

/**
 * GET weekly schedule for the logged-in child (child view). No childId – uses current user.
 *
 * Expected response: same shape as getWeeklySchedule (familyTasksList or array of tasks
 * with id, title, description, days (string[]), localTime, ...).
 */
export const getChildWeeklySchedule = async (idToken) => {
  const url = `${BACKEND_BASE_URL}/child_weekly_schedule`;
  try {
    const res = await axios.get(url, {
      headers: authHeader(idToken),
    });
    const raw = res.data?.familyTasksList ?? res.data?.tasks ?? res.data;
    if (Array.isArray(raw)) return raw.map(normalizeWeeklyTask);
    return raw ?? [];
  } catch (error) {
    console.error('❌ Failed to fetch child weekly schedule:', error.message);
    throw error;
  }
};

/**
 * Clear all weekly assignments for a task. Optional childId to clear for one child only.
 *
 * Expected response: { success?: boolean } or 204/200.
 */
export const clearTaskWeeklySchedule = async (taskId, idToken, childId = null) => {
  const url = `${BACKEND_BASE_URL}/clear_weekly_schedule/${taskId}`;
  try {
    const res = await axios.delete(url, {
      headers: authHeader(idToken),
      ...(childId != null && { params: { childId } }),
    });
    return res.data;
  } catch (error) {
    console.error('❌ Failed to clear weekly schedule:', error.message);
    throw error;
  }
};
