import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getKidsByFamily } from '../api/firebaseTasks';
import { useCompletions } from '../context/CompletionsContext'; // your completions context
import TaskItem from '../components/TaskItem';
import './ParentApprovalPage.css';



function ParentApprovalPage() {
  const { user, loading } = useAuth();
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTimes, setEditedTimes] = useState({});
  const [editTimeInput, setEditTimeInput] = useState('');
  const [parentComments, setParentComments] = useState({});
  const {
    completions,
    loading: completionsLoading,
    error: completionsError,
    approveCompletion,
    rejectCompletion,
    refreshCompletions,
  } = useCompletions();
  


  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      setError('');
      try {
        const familyChildren = await getKidsByFamily(user.familyId, user.token);
        setChildren(familyChildren);
      } catch (e) {
        setError('Failed to load children');
        console.error(e);
      }
    };

    fetchChildren();
  }, [user]);

  // Group completions by child uid for display
  const completionsByChild = completions.reduce((acc, completion) => {
    const childId = completion.kidId;
    if (!acc[childId]) acc[childId] = [];
    acc[childId].push(completion);
    return acc;
  }, {});

  const getEffectiveTime = (task) => editedTimes[task.taskId] ?? task.time;

  const handleStartEditTime = (task) => {
    setEditingTaskId(task.taskId);
    setEditTimeInput(String(getEffectiveTime(task)));
  };

  const handleSaveEditTime = (taskId) => {
    const num = Number(editTimeInput);
    if (!Number.isNaN(num) && num >= 0) {
      setEditedTimes((prev) => ({ ...prev, [taskId]: num }));
    }
    setEditingTaskId(null);
  };

  const handleCancelEditTime = () => {
    setEditingTaskId(null);
  };

  const handleApproval = async (childId, completionId, time, isApproved, parentComment = '') => {
    try {
      if (isApproved) {
        await approveCompletion(completionId, childId, time, parentComment);
      } else {
        await rejectCompletion(completionId, childId, time, parentComment);
      }
      // Clear edited time for this completion and refresh
      setEditedTimes((prev) => {
        const next = { ...prev };
        delete next[completionId];
        return next;
      });
      setParentComments((prev) => {
        const next = { ...prev };
        delete next[completionId];
        return next;
      });
      await refreshCompletions();
      const familyChildren = await getKidsByFamily(user.familyId, user.token);
      setChildren(familyChildren);
    } catch (err) {
      console.error('Approval error:', err);
      alert('❌ Failed to process task.');
    }
  };

  if (loading || completionsLoading) {
    return (
      <div className="approval-page-container">
        <div className="approval-loading" aria-label="Loading">
          <div className="approval-loading-spinner" />
          <span className="approval-loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'PARENT') {
    return (
      <div className="approval-page-container">
        <div className="approval-message approval-message-warning">
          🚫 Please log in as a parent to see this page.
        </div>
      </div>
    );
  }

  return (
    <div className="approval-page-container">
      <h2 className="approval-page-header">Pending Tasks for Approval</h2>
      {(error || completionsError) && (
        <div className="approval-message approval-message-error">
          {error || completionsError}
        </div>
      )}
      <div className="approval-cards">
        {children.length === 0 && (
          <p className="approval-empty-state">No children found in your family.</p>
        )}
        {children.map((child) => (
          <div key={child.uid} className="approval-card-wrapper">
            <div className="approval-card">
              <div className="approval-card-header">
                {child.nickname || child.email || child.uid}
              </div>
              <div className="approval-card-body">
                {completionsByChild[child.uid]?.length ? (
                  completionsByChild[child.uid].map((task) => (
                    <div key={task.taskId} className="approval-task-item">
                      <TaskItem task={{ ...task, time: getEffectiveTime(task) }} />
                      {task.childComment && (
                        <div className="approval-child-comment">
                          <strong>Child&apos;s comment:</strong> {task.childComment}
                        </div>
                      )}
                      <div className="approval-parent-comment">
                        <label className="approval-time-label" htmlFor={`parent-comment-${task.taskId}`}>
                          Parent&apos;s comment (optional):
                        </label>
                        <textarea
                          id={`parent-comment-${task.taskId}`}
                          className="approval-parent-comment-input"
                          placeholder="Add a note for your child..."
                          value={parentComments[task.taskId] || ''}
                          onChange={(e) =>
                            setParentComments((prev) => ({
                              ...prev,
                              [task.taskId]: e.target.value,
                            }))
                          }
                          rows={2}
                        />
                      </div>
                      <div className="approval-time-row">
                        {editingTaskId === task.taskId ? (
                          <>
                            <label className="approval-time-label">Time (min):</label>
                            <input
                              type="number"
                              className="approval-time-input"
                              value={editTimeInput}
                              onChange={(e) => setEditTimeInput(e.target.value)}
                              min={0}
                            />
                            <button
                              type="button"
                              className="approval-button approval-button-save"
                              onClick={() => handleSaveEditTime(task.taskId)}
                            >
                              💾 Save
                            </button>
                            <button
                              type="button"
                              className="approval-button approval-button-cancel"
                              onClick={handleCancelEditTime}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="approval-time-display">
                              ⏰ {getEffectiveTime(task)} min
                            </span>
                            <button
                              type="button"
                              className="approval-button approval-button-update"
                              onClick={() => handleStartEditTime(task)}
                            >
                              ✏️ Update
                            </button>
                          </>
                        )}
                      </div>
                      <div className="approval-card-actions">
                        <button
                          type="button"
                          className="approval-button approval-button-approve"
                          onClick={() =>
                            handleApproval(
                              child.uid,
                              task.taskId,
                              getEffectiveTime(task),
                              true,
                              parentComments[task.taskId] || ''
                            )
                          }
                        >
                          ✅ Approve
                        </button>
                        <button
                          type="button"
                          className="approval-button approval-button-reject"
                          onClick={() =>
                            handleApproval(
                              child.uid,
                              task.taskId,
                              getEffectiveTime(task),
                              false,
                              parentComments[task.taskId] || ''
                            )
                          }
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="approval-empty-state">No tasks waiting for approval.</p>
                )}
              </div>
              <div className="approval-card-footer">
                <div className="time-info total-time">
                  <strong>Total Time:</strong>
                  <span className="time-value">{child.totalTime || 0} mins</span>
                </div>
                <div className="time-info pending-time">
                  <strong>Pending Time:</strong>
                  <span className="time-value">{child.pendingTime || 0} mins</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParentApprovalPage;
