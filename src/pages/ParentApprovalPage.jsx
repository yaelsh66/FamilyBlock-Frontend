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

  const handleApproval = async (childId, completionId, time, isApproved) => {
    try {
      if (isApproved) {
        await approveCompletion(completionId, childId, time);
      } else {
        await rejectCompletion(completionId, childId, time);
      }
      // Refresh both the completions list and children list
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
                      <TaskItem task={task} />
                      <div className="approval-card-actions">
                        <button
                          type="button"
                          className="approval-button approval-button-approve"
                          onClick={() =>
                            handleApproval(child.uid, task.taskId, task.time, true)
                          }
                        >
                          ✅ Approve
                        </button>
                        <button
                          type="button"
                          className="approval-button approval-button-reject"
                          onClick={() =>
                            handleApproval(child.uid, task.taskId, task.time, false)
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
