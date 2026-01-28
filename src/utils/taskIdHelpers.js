// src/utils/taskIdHelpers.js

/**
 * Get the correct task ID based on whether it's assigned or available
 * - Assigned tasks: use instanceId (or id if it's the instance ID)
 * - Available/template tasks: use templateId (or id if it's the template ID)
 */
export const getTaskId = (task, isAssigned = false) => {
  if (isAssigned) {
    // For assigned tasks, prefer instanceId
    return task.instanceId || task.id;
  }
  // For available/template tasks, use templateId
  return task.templateId || task.id;
};

/**
 * Get template ID from a task (for operations on templates)
 */
export const getTemplateId = (task) => {
  return task.templateId || task.id;
};

/**
 * Get instance ID from a task (for operations on instances)
 */
export const getInstanceId = (task) => {
  return task.instanceId || task.id;
};
