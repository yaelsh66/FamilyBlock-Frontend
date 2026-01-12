// src/api/firebaseTasks.js
import axios from 'axios';

const PROJECT_ID = 'family-c56e3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const BACKEND_BASE_URL = 'http://localhost:8081/api/task';
const QUERY_URL = `${BASE_URL}:runQuery`;

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });


// src/api/firebaseTasks.js
export const getParentsByFamily = async (familyId, token) => {
  const res = await axiosInstance.get(`/families/${familyId}/parents`, {
    headers: authHeader(token),
  });
  return res.data;
};

export const getUsersByFamily = async (familyId, token) => {
  const url = `${BASE_URL}:runQuery`;

  const payload = {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: 'familyId' },
                op: 'EQUAL',
                value: { stringValue: familyId },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: 'role' },
                op: 'EQUAL',
                value: { stringValue: 'child' },
              },
            },
          ],
        },
      },
    },
  };

  try {
    const response = await axiosInstance.post(url, payload, {
      headers: authHeader(token),
    });

    return response.data
      .filter((res) => res.document)
      .map((res) => {
        const f = res.document.fields;
        return {
          uid: res.document.name.split('/').pop(),
          email: f.email?.stringValue || '',
          nickname: f.nickname?.stringValue || '',
          role: f.role?.stringValue || '',
          familyId: f.familyId?.stringValue || '',
          totalTime: parseFloat(f.totalTime?.doubleValue || f.totalTime?.integerValue || '0'),
          pendingTime: parseFloat(f.pendingTime?.doubleValue || f.pendingTime?.integerValue || '0'),
          whatsAppNumber: f.whatsAppNumber?.stringValue || '',
        };
      });
  } catch (error) {
    console.error('Failed to fetch children:', error);
    throw error;
  }
};

export const getKidsByFamily = async (familyId, token) => {
  const res = await api.get(`/families/${familyId}/children`, {
    headers: authHeader(token),
  });
  return res.data;
};

export const addTask = async (task, token) => {
  const res = await api.post('/tasks', task, {
    headers: authHeader(token),
  });
  return res.data;
};

export const updateTask = async (taskId, updates, token) => {
  const res = await api.patch(`/tasks/${taskId}`, updates, {
    headers: authHeader(token),
  });
  return res.data;
};

export const deleteTask = async (taskId, token) => {
  await api.delete(`/tasks/${taskId}`, {
    headers: authHeader(token),
  });
};

export const submitCompletion = async (taskId, token) => {
  const res = await api.post(`/tasks/${taskId}/complete`, {}, {
    headers: authHeader(token),
  });
  return res.data;
};

export const approveCompletion = async (completionId, token) => {
  await api.post(`/completions/${completionId}/approve`, {}, {
    headers: authHeader(token),
  });
};

export const rejectCompletion = async (completionId, token) => {
  await api.post(`/completions/${completionId}/reject`, {}, {
    headers: authHeader(token),
  });
};

export const getPendingCompletionsForFamily = async (familyId, token) => {
  const res = await api.get(`/families/${familyId}/pending-completions`, {
    headers: authHeader(token),
  });
  return res.data;
};


export const withdrawTime = async (childId, minutes, token) => {
  try {
    // 1. Fetch current user document
    const userRes = await axiosInstance.get(`/users/${childId}`, {
      headers: authHeader(token),
    });

    const fields = userRes.data.fields || {};
    const currentTotal = parseFloat(fields.totalTime?.doubleValue || fields.totalTime?.integerValue || '0');

    // 2. Calculate new total time (no negative)
    const newTotal = Math.max(0, currentTotal - minutes);

    // 3. PATCH update only the totalTime field
    const patchPayload = {
      fields: {
        totalTime: { doubleValue: newTotal },
      },
    };

    const updateRes = await axiosInstance.patch(`/users/${childId}?updateMask.fieldPaths=totalTime`, patchPayload, {
      headers: authHeader(token),
    });

    return updateRes.data;
  } catch (error) {
    console.error('Failed to withdraw time:', error);
    throw error;
  }
};
// 🔄 Get all tasks for a family
export const getTasksForFamily = async (idToken) => {

  const url = `${BACKEND_BASE_URL}/family_tasks`;
  try{
    console.log("FETCH family TASKS RESPONSE START");
    const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  console.log("FETCH FAMILY TASKS RESPONSE:", res.data);
  return res.data.familyTasksList ?? [];
  }catch (error) {
    console.error('❌ Failed to fatch family tasks:', error.message);
    throw error;
  }
  
}
export const getTasksForFamily2 = async (familyId, token) => {
  const res = await api.get(`/families/${familyId}/tasks`, {
    headers: authHeader(token),
  });
  return res.data;
};


// 📥 Get tasks for a child
export const getTasksForChild = async (idToken) => {

  const url = `${BACKEND_BASE_URL}/child_tasks`;
  try{
    const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  console.log("FETCH CHILD TASKS RESPONSE:", res.data.childTasksList);
  return res.data.childTasksList ?? [];
  }catch (error) {
    console.error('❌ Failed to fatch child tasks:', error.message);
    throw error;
  }
  
}
export const getTasksForChild2 = async (childId, token) => {
  const res = await api.get(`/children/${childId}/tasks`, {
    headers: authHeader(token),
  });
  return res.data;
};

// ➕ Add new task task.title, description, time (minutes), assignedTo[]
export const addTaskToBackend = async (task, idToken) => {
  const url = `${BACKEND_BASE_URL}/new_task`;

  const fields = {
    title: task.title,
    description: task.description,
    screenTime: task.time,
  };
  
  try{
    console.log("task fields: ", fields);
    await axios.post(url, fields, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
  }catch (error) {
    console.error('❌ Failed to create new task:', error.message);
    throw error;
  
  };
}
export const addTaskToFirestore = async (task, token) => {
  const payload = {
    fields: {
      title: { stringValue: task.title },
      description: { stringValue: task.description },
      time: Number.isInteger(task.time)
        ? { integerValue: task.time }
        : { doubleValue: task.time },
      createdBy: { stringValue: task.createdBy },
      familyId: { stringValue: task.familyId },
      assignedTo: {
        arrayValue: {
          values: (task.assignedTo || []).map((uid) => ({ stringValue: uid })),
        },
      },
      createdAt: { timestampValue: new Date().toISOString() },
    },
  };

  const res = await axiosInstance.post(`/tasks`, payload, {
    headers: authHeader(token),
  });
  return res.data;
};


// 🔁 Update task assignments
export const updateTaskAssignment = async (taskId, newAssignedTo, token) => {
  const payload = {
    fields: {
      assignedTo: {
        arrayValue: {
          values: newAssignedTo.map((uid) => ({ stringValue: uid })),
        },
      },
    },
  };

  const res = await axiosInstance.patch(`/tasks/${taskId}?updateMask.fieldPaths=assignedTo`, payload, {
    headers: authHeader(token),
  });

  return res.data;
};

// ✅ Send approval request and increment pendingTime
export const sendApprovalRequest = async (parentId, task, childId, token) => {
  const approvalDocId = `${childId}_${task.id}`;
  const approvalPayload = {
    fields: {
      taskId: { stringValue: task.id },
      title: { stringValue: task.title },
      completedAt: { timestampValue: new Date().toISOString() },
      time: { doubleValue: task.time },
      childId: { stringValue: childId },
      familyId: { stringValue: task.familyId || '' },
      approved: { booleanValue: false },
    },
  };

  // ✅ Write to completions collection
  const approvalRes = await axiosInstance.post(
    `/completions?documentId=${approvalDocId}`,
    approvalPayload,
    {
      headers: authHeader(token),
    }
  );

  // ⏱️ Update child's pendingTime (keep as-is)
  const userRes = await axiosInstance.get(`/users/${childId}`, {
    headers: authHeader(token),
  });

  const currentPending = parseFloat(
    userRes.data.fields?.pendingTime?.doubleValue || 0
  );

  await axiosInstance.patch(
    `/users/${childId}?updateMask.fieldPaths=pendingTime`,
    {
      fields: {
        pendingTime: { doubleValue: currentPending + task.time },
      },
    },
    {
      headers: authHeader(token),
    }
  );

  return approvalRes.data;
};


export const getPendingCompletionsForChild = async (childId, token) => {
  const payload = {
    structuredQuery: {
      from: [{ collectionId: 'completions' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: 'childId' },
                op: 'EQUAL',
                value: { stringValue: childId },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: 'approved' },
                op: 'EQUAL',
                value: { booleanValue: false },
              },
            },
          ],
        },
      },
    },
  };

  const res = await axios.post(QUERY_URL, payload, {
    headers: authHeader(token),
  });

  return res.data
    .filter((d) => d.document)
    .map((d) => {
      const f = d.document.fields;
      return {
        id: d.document.name.split('/').pop(),
        taskId: f.taskId?.stringValue || '',
        title: f.title?.stringValue || '',
        time: parseFloat(f.time?.doubleValue || 0),
        completedAt: f.completedAt?.timestampValue || '',
        childId: f.childId?.stringValue || '',
        familyId: f.familyId?.stringValue || '',
        approved: f.approved?.booleanValue || false,
      };
    });
};


export const deleteTaskFromFirestore = async (taskId, token) => {
  try {
    const res = await axiosInstance.delete(`/tasks/${taskId}`, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to delete task ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
};

// 🔔 Create one weekly‐assignment doc for a single day
export const createDailyAssignment = async ({
  familyId,
  userId,
  role,
  title,
  description,
  screenTime,   // minutes
  day,          // 0 = Sunday … 6 = Saturday
  timeSlot      // "HH:MM"
}, token) => {
  // POST to /documents/weeklyAssignments to auto-generate doc ID
  const url = `/weeklyAssignments`;
  const payload = {
    fields: {
      familyId:    { stringValue: familyId },
      userId:      { stringValue: userId },
      role:        { stringValue: role },
      title:       { stringValue: title },
      description: { stringValue: description },
      screenTime:  { integerValue: screenTime.toString() },
      day:         { integerValue: day.toString() },
      timeSlot:    { stringValue: timeSlot },
      createdAt:   { timestampValue: new Date().toISOString() }
    }
  };
  const res = await axiosInstance.post(url, payload, {
    headers: authHeader(token),
  });
  return res.data;
};

export const deleteDailyAssignment = async (assignmentId, token) => {
  return axiosInstance.delete(`/weeklyAssignments/${assignmentId}`, {
    headers: authHeader(token)
  });
};

// 🔍 Query weekly assignments for a single child
export const getWeeklyAssignmentsForChild = async (childId, token) => {
  // Firestore REST API runQuery
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const payload = {
    structuredQuery: {
      from: [{ collectionId: 'weeklyAssignments' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'userId' },
          op: 'EQUAL',
          value: { stringValue: childId }
        }
      }
    }
  };

  const response = await axiosInstance.post(url, payload, {
    headers: authHeader(token)
  });
  return response.data
    .filter(r => r.document)
    .map(r => {
      const f = r.document.fields;
      return {
        id:          r.document.name.split('/').pop(),
        day:         parseInt(f.day.integerValue, 10),
        timeSlot:    f.timeSlot.stringValue,
        title:       f.title.stringValue,
        description: f.description.stringValue,
        screenTime:  parseInt(f.screenTime.integerValue, 10),
        userId:      f.userId.stringValue,
        role:        f.role.stringValue,
        createdAt:   f.createdAt.timestampValue
      };
    });
};