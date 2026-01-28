// src/components/TasksList.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import TaskItem from './TaskItem';
import { useTaskContext } from '../context/TaskContext';
import './TasksList.css';

function TasksList() {
  const { allFamilyTasks: tasks, updateTask} = useTaskContext();

  const { user, loading } = useAuth();
  
  const [error, setError] = useState('');

  const handleUpdateTask = async (taskId, updatedData) => {
    setError('');
    try {
      await updateTask(taskId, {
        title: updatedData.title,
        description: updatedData.description,
        time: Number(updatedData.time),
      });
    } catch (err) {
      console.error('Update failed in TasksList:', err);
      setError('❌ Failed to update task.');
    }
  };


  if (loading) {
    return (
      <div className="tasks-list-container-center">
        <span className="tasks-list-spinner"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="tasks-list-container">
        <div className="tasks-list-alert tasks-list-alert-warning">
          🚫 Please log in to view tasks.
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-list-container">
      <h2 className="tasks-list-title">📋 Task List</h2>
      {error && (
        <div className="tasks-list-alert tasks-list-alert-danger">
          {error}
        </div>
      )}
      {tasks.length === 0 ? (
        <div className="tasks-list-alert tasks-list-alert-info">
          No tasks available yet.
        </div>
      ) : (
        <ul className="tasks-list-group">
          {tasks.map((task, idx) => (
            <li key={idx} className="tasks-list-item">
              <TaskItem task={task} onStartUpdate={handleUpdateTask} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksList;