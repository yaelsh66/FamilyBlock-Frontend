import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTaskContext } from '../../context/TaskContext';
import './AddTaskForm.css';

function AddTaskForm({ show, onHide }) {
  const { user, loading } = useAuth(); // Include loading state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const { addTask} = useTaskContext();

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setTitle('');
      setDescription('');
      setAmount('');
      setSuccess(false);
    }
  }, [show]);

  const isModal = show !== undefined && onHide !== undefined;

  if (loading) {
    return isModal ? null : (
      <div className="add-task-page">
        <div className="add-task-card add-task-message-card">
          <h4 className="add-task-message-title">Loading...</h4>
        </div>
      </div>
    );
  }

  if (!user) {
    return isModal ? null : (
      <div className="add-task-page">
        <div className="add-task-card add-task-message-card">
          <div className="add-task-alert add-task-alert-warning">
            You must be logged in to add tasks.
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    const task = {
      title,
      description,
      time: parseFloat(time) || 0,
      createdBy: user.uid,
      

    };

    try {
      await addTask(task, user.token);
      setTitle('');
      setDescription('');
      setAmount('');
      setSuccess(true);
      
      // Close modal after successful submission
      if (isModal) {
        setTimeout(() => {
          if (onHide) onHide();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setSuccess(false);
    if (onHide) onHide();
  };

  const formContent = (
    <>
      <div className="add-task-field">
        <label htmlFor="task-title" className="add-task-label">
          Task Title
        </label>
        <input
          id="task-title"
          type="text"
          className="add-task-input"
          placeholder="Walk the dog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="add-task-field">
        <label htmlFor="task-description" className="add-task-label">
          Comment
        </label>
        <textarea
          id="task-description"
          className="add-task-textarea"
          placeholder="Describe the task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="add-task-field">
        <label htmlFor="task-time" className="add-task-label">
          Reward Screen Time (minutes)
        </label>
        <input
          id="task-time"
          type="number"
          className="add-task-input"
          placeholder="Amount in minutes"
          value={time}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="1"
        />
      </div>
    </>
  );

  // Render as Modal if show/onHide props are provided
  if (isModal) {
    if (!show) {
      return null;
    }

    return (
      <div className="add-task-backdrop" role="dialog" aria-modal="true">
        <div className="add-task-modal">
          <div className="add-task-modal-header">
            <h2 className="add-task-modal-title">📝 Add New Task</h2>
            <button
              type="button"
              className="add-task-close-btn"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-task-form">
            {formContent}

            {success && (
              <div className="add-task-alert add-task-alert-success">
                Task added successfully!
              </div>
            )}

            <div className="add-task-button-row">
              <button
                type="button"
                className="add-task-btn add-task-btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-task-btn add-task-btn-primary"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render as page component (backward compatibility)
  return (
    <div className="add-task-page">
      <div className="add-task-card">
        <h2 className="add-task-title">📝 Add New Task</h2>
        <form onSubmit={handleSubmit} className="add-task-form">
          {formContent}

          <button
            type="submit"
            className="add-task-btn add-task-btn-primary add-task-btn-full"
          >
            Add Task
          </button>

          {success && (
            <div className="add-task-alert add-task-alert-success">
              Task added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddTaskForm;
