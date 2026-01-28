// src/api/firebaseTasks.js
import axios from 'axios';

const PROJECT_ID = 'family-c56e3';

const BACKEND_BASE_URL2 = 'http://localhost:8081/api/task';
const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/task`;    


const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const getKidsByFamily = async (familyId, idToken) => {
  const url = `${BACKEND_BASE_URL}/family_kids`;
  const payload = {
    familyId: familyId,
  };
  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  console.log("GET KIDS BY FAMILY RESPONSE:", res.data);
  return res.data;
}

export const updateTask = async (taskId, updates, idToken) => {
  const url = `${BACKEND_BASE_URL}/update_task_tamplate`;
  const payload = {
    id: taskId,
    title: updates.title,
    description: updates.description,
    screenTime: updates.time,
  };
  try{
    console.log("task id: " ,payload.id);
    console.log("task title: " ,payload.title);
    console.log("task description: " ,payload.description);
    console.log("task time: " ,payload.screenTime);
    const res = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  }catch (error) {
    console.error('❌   Failed to updateTask: ', error.message);
    throw error;
  }
  const res = await axios.patch(url, payload, idToken)
}

export const deleteTaskBackend = async (taskId, idToken) => {
  const url = `${BACKEND_BASE_URL}/delete_task/${taskId}`;
  
  console.log("task id: " ,taskId);
  try{
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
  }catch (error) {
    console.error('❌   Failed to deleteTask: ', error.message);
    throw error;
  }
}


export const submitCompletion = async (taskId, comment = '', idToken) => {
  const url = `${BACKEND_BASE_URL}/submit_completion`;
  const payload = {
    tastInstanceId: taskId,
    comment: comment || '',
  };
  try{
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
        });
    console.log("SUBMIT COMPLETION RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error('❌   Failed to submit completion:', error.message);
    throw error;
  }
  
};

export const approveCompletion = async (completionId, childId, time, idToken) => {
  const url = `${BACKEND_BASE_URL}/approve_completion`;
  const payload = {
    completionId: completionId,
    childId: childId,
    time: time,
  };
  try{
  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  return res.data;
  } catch (error) {
    console.error('❌ Failed to approve completion:', error.message);
    throw error;
  }
}


export const rejectCompletion = async (completionId, childId, time, idToken) => {
  const url = `${BACKEND_BASE_URL}/reject_completion`;
  const payload = {
    completionId: completionId,
    childId: childId,
    time: time,
  };
  try{
  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  return res.data;
  } catch (error) {
    console.error('❌ Failed to reject completion:', error.message);
    throw error;
  }
}


export const getPendingCompletionsForFamily = async (familyId, idToken) => {
  const url = `${BACKEND_BASE_URL}/family_pending_completions`;
  const payload = {
    familyId: familyId,
  };
  try{
  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  return res.data;
  console.log("GET PENDING COMPLETIONS FOR FAMILY RESPONSE:", res.data);
} catch (error) {
  console.error('❌ Failed to get pending completions for family:', error.message);
  throw error;
}
}

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
  console.log("FETCH FAMILY TASKS RESPONSE:", res.data.familyTasksList);
  return res.data.familyTasksList ?? [];
  }catch (error) {
    console.error('❌ Failed to fatch family tasks:', error.message);
    throw error;
  }
  
}

// 📥 Get tasks for a child
export const getTasksForChild = async (idToken) => {

  const url = `${BACKEND_BASE_URL}/child_tasks`;
  try{
    const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  return res.data.familyTasksList ?? [];
  }catch (error) {
    console.error('❌ Failed to fatch child tasks:', error.message);
    throw error;
  }
  
}


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
export const updateTaskAssignment = async (taskId, newAssignedTo, token) => {
  const url = `${BACKEND_BASE_URL}/update_task_assignment`;
  const payload = {
    taskId: taskId,
    newAssignedTo: newAssignedTo,
  };
  const res = await axios.post(url, payload, {
    headers: authHeader(token),
  });
  return res.data;
};

export const withdrawTime = async (childId, minutes, idToken) => {
  const url = `${BACKEND_BASE_URL}/withdraw_time`;
  const payload = {
    childId: childId,
    minutes: minutes,
  };
  try{
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
    return res.data;
  }catch (error) {
    console.error('❌ Failed to create new task:', error.message);
    throw error;
  };
}

export const withdrawTimeStop = async (idToken) => {
    const url = `${BACKEND_BASE_URL}/withdraw_time_stop`;
    try{
      const res = await axios.patch(url, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });
    }catch (error) {
      console.error('❌ Failed to withdrawTimeStop:', error.message);
      throw error;
    };
}

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
  const url = ``;
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

