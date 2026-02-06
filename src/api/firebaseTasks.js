// src/api/firebaseTasks.js
import axios from 'axios';

const PROJECT_ID = 'family-c56e3';

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

export const approveCompletion = async (completionId, childId, time, parentComment = '', idToken) => {
  const url = `${BACKEND_BASE_URL}/approve_completion`;
  const payload = {
    completionId: completionId,
    childId: childId,
    time: time,
    parentComment: parentComment || '',
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


export const rejectCompletion = async (completionId, childId, time, parentComment = '', idToken) => {
  const url = `${BACKEND_BASE_URL}/reject_completion`;
  const payload = {
    completionId: completionId,
    childId: childId,
    time: time,
    parentComment: parentComment || '',
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

// 📜 Task history for a specific child (parent view)
export const getTaskHistoryForChild = async (childId, idToken) => {
  const url = `${BACKEND_BASE_URL}/family_task_history`;
  const payload = {
    childId: childId,
  };
  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log('FETCH TASK HISTORY FOR CHILD RESPONSE:', res.data);
    const data = res.data;
    return Array.isArray(data) ? data : (data?.tasks ?? []);
  } catch (error) {
    console.error('❌ Failed to fetch task history for child:', error.message);
    throw error;
  }
};

// 📜 Task history for the currently logged-in child
export const getMyTaskHistory = async (idToken) => {
  const url = `${BACKEND_BASE_URL}/child_task_history`;
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log('FETCH MY TASK HISTORY RESPONSE:', res.data);
    const data = res.data;
    return Array.isArray(data) ? data : (data?.tasks ?? []);
  } catch (error) {
    console.error('❌ Failed to fetch my task history:', error.message);
    throw error;
  }
};

// ✏️ Allow a child to update their task instance (e.g. comment/status)
export const updateTaskByChild = async (taskInstanceId, updates, idToken) => {
  const url = `${BACKEND_BASE_URL}/child_update_task`;
  const payload = {
    taskInstanceId,
    ...updates,
  };

  try {
    const res = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('UPDATE TASK BY CHILD RESPONSE:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to update task by child:', error.message);
    throw error;
  }
};
