// src/pages/ChildHomePage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AmountBox from '../../components/AmountBox';
import { useScreenTime } from '../../context/ScreenTimeContext';
import { useTaskContext } from '../../context/TaskContext';
import TaskItem from '../../components/TaskItem';
import { submitCompletion } from '../../api/firebaseTasks';
import { completeWeeklyTask } from '../../api/weeklyApi';
import { getIsRunningApi } from '../../api/deviceApi';
import './ChildHomePage.css';

function ChildHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalScreenTime, pendingScreenTime, withdrawScreenTime, withdrawScreenTimeStop,
    refreshScreenTime, addToPendingScreenTime } = useScreenTime();
  const { assignedTasks, weeklyAssignments, refreshTasks } = useTaskContext();
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Today's incomplete weekly tasks (assigned for today, wasCompleteToday = false)
  const todayWeeklyTasks = useMemo(() => {
    const todayIndex = new Date().getDay();
    const todaySlots = weeklyAssignments?.[todayIndex] || {};
    return Object.values(todaySlots)
      .flat()
      .filter((t) => t.wasCompleteToday === false) ?? [];
  }, [weeklyAssignments]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchIsRunning = async () => {
      if (!user?.id || !user?.token) {
        setIsRunning(false);
        return;
      }
      const childId = Number(user.id);
      try {
        const res = await getIsRunningApi(childId, user.token);
        setIsRunning(res.isRunning ?? false);
      } catch (error) {
        console.error('Failed to get is running:', error);
        setIsRunning(false);
      }
    };
    fetchIsRunning();
  }, [user?.id, user?.token]);

  

  const handleGoToTasks = () => {
    navigate('/child/tasks');
  };

  const handleStartTime = async () => {
    const minutes = totalScreenTime;
    setIsRunning(true);
    try {
      const res = await withdrawScreenTime(minutes);
      alert(res.response);
    } catch (err) {
      console.error(err);
      alert('❌ started time failed.');
      setIsRunning(false);
    }
  };

  const handleStopTime = async () => {
    setIsRunning(false);
    try {
      await withdrawScreenTimeStop();
      alert(`✅ You stopped time`);
    } catch (err) {
      console.error(err);
      alert('❌ stop time failed.');
      setIsRunning(true);
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
    const isWeekly = selectedTask.isWeekly === true;

    try {
      if (isWeekly) {
        await completeWeeklyTask(selectedTask.id, user.token, undefined, comment);
      } else {
        await submitCompletion(selectedTask.id, comment, user.token);
      }

      const minutesReward = selectedTask.time ?? selectedTask.minutesReward ?? 0;
      if (minutesReward > 0) {
        await addToPendingScreenTime(minutesReward);
      }

      await refreshTasks();

      setShowCommentModal(false);
      setSelectedTask(null);
      setComment('');
      alert(`✅ Task "${selectedTask.title}" marked as completed!${!isWeekly ? ' Waiting for approval.' : ''}`);
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
      {isRunning && (
        <div className="child-home-running-banner" role="status" aria-live="polite">
          ⏱️ Screen time is running
        </div>
      )}
      <div className="child-home-container">
        <h2 className="child-home-title">Hi 👦 {user?.nickname}</h2>

        <div className="child-home-row">
          <div className="child-home-col child-home-col-left">
            <AmountBox label="🕒 My Screen Time" time={totalScreenTime} />
            <button
                className="child-home-button btn-success"
                onClick={() => handleStartTime()}
                disabled={isRunning || totalScreenTime <= 0}
              >
                Start Time
              </button>
              <button
                className="child-home-button btn-danger"
                onClick={() => handleStopTime()}
                disabled={!isRunning}
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
              {assignedTasks.length === 0 && todayWeeklyTasks.length === 0 ? (
                <p className="child-home-no-tasks">No assigned tasks yet.</p>
              ) : (
                <>
                  {assignedTasks.length > 0 && (
                    <div className="child-home-tasks-section">
                      <h4 className="child-home-tasks-section-title">Assigned tasks</h4>
                      {assignedTasks.map((task) => (
                        <TaskItem
                          key={`assigned-${task.id}`}
                          task={task}
                          isAssigned={true}
                          onComplete={(t) => handleComplete({ ...t, isWeekly: false })}
                        />
                      ))}
                    </div>
                  )}
                  {todayWeeklyTasks.length > 0 && (
                    <div className="child-home-tasks-section">
                      <h4 className="child-home-tasks-section-title">Today&apos;s schedule</h4>
                      {todayWeeklyTasks.map((task) => (
                        <TaskItem
                          key={`weekly-${task.id}`}
                          task={{ ...task, time: task.time ?? task.minutesReward ?? 0 }}
                          isAssigned={true}
                          onComplete={(t) => handleComplete({ ...t, isWeekly: true })}
                        />
                      ))}
                    </div>
                  )}
                </>
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
