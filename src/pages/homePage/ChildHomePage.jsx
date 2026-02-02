// src/pages/ChildHomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AmountBox from '../../components/AmountBox';
import { useScreenTime } from '../../context/ScreenTimeContext';
import { useTaskContext } from '../../context/TaskContext';
import TaskItem from '../../components/TaskItem';
import { submitCompletion } from '../../api/firebaseTasks';
import './ChildHomePage.css';

function ChildHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalScreenTime, pendingScreenTime, withdrawScreenTime, withdrawScreenTimeStop, refreshScreenTime, addToPendingScreenTime } = useScreenTime();
  const { assignedTasks, refreshTasks } = useTaskContext();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');

  

  const handleGoToTasks = () => {
    navigate('/child/tasks');
  };

  const handleStartTime = async () => {
    const minutes = totalScreenTime;
    try {
 
      const res = await withdrawScreenTime(minutes);
      alert(res.response); // ✅ update local state and database
    //  alert(`✅ You strted time`);
  
    } catch (err) {
      console.error(err);
      alert('❌ strted time failed.');
    }
  };

  const handleStopTime = async () => {
    
    try {
 
      await withdrawScreenTimeStop(); // ✅ update local state and database
      alert(`✅ You stop time`);
  
    } catch (err) {
      console.error(err);
      alert('❌ stop time failed.');
    }
  };

  const handleWithdraw = async () => {
  const input = prompt('How many minutes would you like to withdraw?');

  const minutes = parseFloat(input);
  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid number greater than 0');
    return;
  }

  if (minutes > totalScreenTime) {
    alert('You cannot withdraw more than your total time.');
    return;
  }

  try {
 
    await withdrawScreenTime(minutes); // ✅ update local state and database
    alert(`✅ You successfully withdrew ${minutes} minutes.`);

  } catch (err) {
    console.error(err);
    alert('❌ Withdrawal failed.');
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
      // Call backend to submit completion with comment
      await submitCompletion(selectedTask.id, comment, user.token);

      // Update pending screen time
      await addToPendingScreenTime(selectedTask.time);

      // Refresh the task list to remove the completed task
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


  return (
    <div className="child-home-page">
      <button className="child-home-button child-home-button-sm child-home-refresh-top" onClick={refreshScreenTime}>🔄 Refresh Time</button>
      <div className="child-home-container">
        <h2 className="child-home-title">Hi 👦 {user?.nickname}</h2>

        <div className="child-home-row">
          <div className="child-home-col child-home-col-left">
            <AmountBox label="🕒 My Screen Time" time={totalScreenTime} />
            <button
                className="child-home-button btn-success"
                onClick={() => handleStartTime()}
                disabled={totalScreenTime <= 0}
              >
                Start Time
              </button>
              <button
                className="child-home-button btn-danger"
                onClick={() => handleStopTime()}
                disabled={totalScreenTime <= 0}
              >
                Stop Time
              </button>
            <AmountBox label="🕒 Waiting for approval" time={pendingScreenTime} />
            <div className="child-home-button-group">
              <button
                className="child-home-button btn-warning"
                onClick={() => handleWithdraw()}
                disabled={totalScreenTime <= 0}
              >
                Withdraw Time
              
              </button>
            </div>
          </div>
          <div className="child-home-col child-home-col-center">
            <button className="child-home-button child-home-button-lg btn-orange" onClick={handleGoToTasks}>
              Start Working
            </button>
          </div>
          <div className="child-home-col child-home-col-right">
            <h3 className="child-home-tasks-title">To Do List</h3>
            
            <div className="child-home-tasks-list">
              {assignedTasks.length === 0 ? (
                <p className="child-home-no-tasks">No assigned tasks yet.</p>
              ) : (
                assignedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isAssigned={true}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="child-home-modal-overlay" onClick={handleCommentModalClose} role="presentation">
          <div className="child-home-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="child-home-modal-title">
            <div className="child-home-modal-header">
              <h3 id="child-home-modal-title" className="child-home-modal-title">Complete Task</h3>
              <button type="button" className="child-home-modal-close" onClick={handleCommentModalClose} aria-label="Close">&times;</button>
            </div>
            <div className="child-home-modal-body">
              <p className="child-home-modal-task-label">
                <strong>Task:</strong> {selectedTask?.title}
              </p>
              <label htmlFor="child-home-comment" className="child-home-modal-label">Add a comment (optional)</label>
              <textarea
                id="child-home-comment"
                className="child-home-modal-textarea"
                placeholder="Enter your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="child-home-modal-footer">
              <button type="button" className="child-home-button child-home-modal-btn child-home-modal-btn-cancel" onClick={handleCommentModalClose}>
                Cancel
              </button>
              <button type="button" className="child-home-button child-home-modal-btn child-home-modal-btn-submit" onClick={handleCommentSubmit}>
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChildHomePage;
