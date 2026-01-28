import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';
import './TaskItem.css';

// Playful yet clean TaskItem. Logic unchanged; UI tweaks: badge wraps, no 🎉 emoji on title.
export default function TaskItem({ task, isAssigned = false, onComplete, onStartUpdate }) {
  const { user } = useAuth();
  const { deleteTask } = useTaskContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!onStartUpdate) return;
    setLoading(true);
    setError('');
    try {
      await onStartUpdate(task.id, editedTask);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      setError('❌ Update failed. Try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setIsEditing(false);
    } catch (err) {
      console.error('Delete task failed:', err);
    }
  };

  return (
    <div className="task-item">
      <div className="task-item-body">
        {error && <div className="task-item-error">{error}</div>}

        {isEditing ? (
          <>  
            <div className="task-form-group">
              <label className="task-form-label">Title</label>
              <input
                className="task-form-control"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                placeholder="Enter new title"
              />
            </div>

            <div className="task-form-group">
              <label className="task-form-label">Description</label>
              <input
                className="task-form-control"
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="task-form-group">
              <label className="task-form-label">Screen Time (minutes)</label>
              <input
                className="task-form-control"
                name="time"
                type="number"
                value={editedTask.time}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="task-actions">
              <button
                className="btn btn-success btn-sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <span className="spinner spinner-sm"></span> : '💾 Save'}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        ) : (
          <>  
            <div className="task-header">
              <h5 className="task-title">
                {task.title}
              </h5>
              <span className="task-badge">
                ⏰ {task.time} min
              </span>
            </div>

            <p className="task-description">
              {task.description}
            </p>

            <div className="task-buttons">
              {isAssigned && onComplete && (
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => onComplete(task)}
                >
                  ✅ Complete
                </button>
              )}

              {!isEditing && onStartUpdate && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Update
                </button>
              )}
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <span className="spinner spinner-sm"></span> : '🗑️ Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
