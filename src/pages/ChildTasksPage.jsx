// src/pages/ChildTasksPage.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import TaskDraggable from '../components/TaskDraggable';
import AmountBox from '../components/AmountBox';
import { useScreenTime } from '../context/ScreenTimeContext';
import { useTaskContext } from '../context/TaskContext';
import { submitCompletion } from '../api/firebaseTasks';
import './ChildTasksPage.css';


function ChildTasksPage() {
  const { user, loading } = useAuth();
  

  const {
    assignedTasks,
    availableTasks,
    reassignTaskOptimistic,
    refreshTasks,
  } = useTaskContext();
  
  const { addToPendingScreenTime } = useScreenTime();
  const [error, setError] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');

  const assignedTotal = assignedTasks.reduce((sum, task) => sum + (task.time || 0), 0);



  const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  const assignedClone = [...assignedTasks];
  const availableClone = [...availableTasks];

  const sourceList =
    source.droppableId === 'assigned' ? assignedClone : availableClone;
  const destList =
    destination.droppableId === 'assigned' ? assignedClone : availableClone;

  const [movedTask] = sourceList.splice(source.index, 1);
  destList.splice(destination.index, 0, movedTask);

  const newAssignedTo =
    destination.droppableId === 'assigned'
      ? user.uid : null;

  try {
    await reassignTaskOptimistic(movedTask.id, newAssignedTo, {
      newAssigned: assignedClone,
      newAvailable: availableClone,
    });
  } catch (err) {
    console.error('Failed to update assignment:', err);
    setError('Failed to update task assignment.');
  }
};

const handleComplete = (task) => {
  setSelectedTask(task);
  setComment('');
  setShowCommentModal(true);
};

const handleCommentSubmit = async () => {
  if (!selectedTask) return;
  
  try {
    // 2. Call backend to submit completion with comment
    await submitCompletion(selectedTask.id, comment, user.token);

    // 3. Update pending screen time
    await addToPendingScreenTime(selectedTask.time);

    // 4. Refresh the task list to remove the completed task
    await refreshTasks();

    setShowCommentModal(false);
    setSelectedTask(null);
    setComment('');
    alert(`✅ Task "${selectedTask.title}" marked as completed! Waiting for approval.`);
  } catch (error) {
    console.error('Failed to mark task as completed:', error);
    alert('❌ Failed to complete task. Try again later.');
  }
};

const handleCommentModalClose = () => {
  setShowCommentModal(false);
  setSelectedTask(null);
  setComment('');
};

  useEffect(() => {
    if (showCommentModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showCommentModal]);

  if (loading) {
    return (
      <div className="child-tasks-container-center">
        <span className="child-tasks-spinner"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="child-tasks-container">
        <div className="child-tasks-alert child-tasks-alert-warning">
          🚫 Please log in.
        </div>
      </div>
    );
  }

  return (
    <div className="child-tasks-container">
      <h2 className="child-tasks-title">👦 {user.nickname}'s Tasks</h2>
      {error && (
        <div className="child-tasks-alert child-tasks-alert-danger">
          {error}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="child-tasks-row">
          <div className="child-tasks-col">
            <div className="assigned-tasks-header">
              <h4>Assigned Tasks</h4>
              <AmountBox
                label="Future Potential"
                time={assignedTotal}
                variant="info"
                size="small"
                icon="💡"
              />
            </div>
            <Droppable droppableId="assigned">
              {(provided) => (
                <div className='task-column' ref={provided.innerRef} {...provided.droppableProps}>
                  {assignedTasks.map((task, idx) => (
                    <TaskDraggable
                      key={task.id}
                      task={task}
                      index={idx}
                      isAssigned={true}
                      onComplete={handleComplete}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="child-tasks-col">
            <h4>Available Tasks</h4>
            <Droppable droppableId="available">
              {(provided) => (
                <div className='task-column' ref={provided.innerRef} {...provided.droppableProps}>
                  {availableTasks.map((task, idx) => (
                    <TaskDraggable
                      key={task.id}
                      task={task}
                      index={idx}
                      isAssigned={false}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="child-tasks-modal-overlay" onClick={handleCommentModalClose} role="presentation">
          <div
            className="child-tasks-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-tasks-modal-title"
          >
            <div className="child-tasks-modal-header">
              <h3 id="child-tasks-modal-title" className="child-tasks-modal-title">Complete Task</h3>
              <button
                type="button"
                className="child-tasks-modal-close"
                onClick={handleCommentModalClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="child-tasks-modal-body">
              <p className="child-tasks-modal-task-label">
                <strong>Task:</strong> {selectedTask?.title}
              </p>
              <label htmlFor="child-tasks-comment" className="child-tasks-modal-label">
                Add a comment (optional)
              </label>
              <textarea
                id="child-tasks-comment"
                className="child-tasks-modal-textarea"
                placeholder="Enter your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="child-tasks-modal-footer">
              <button type="button" className="child-tasks-modal-btn child-tasks-modal-btn-secondary" onClick={handleCommentModalClose}>
                Cancel
              </button>
              <button type="button" className="child-tasks-modal-btn child-tasks-modal-btn-primary" onClick={handleCommentSubmit}>
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChildTasksPage;
