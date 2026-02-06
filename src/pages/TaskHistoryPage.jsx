import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getKidsByFamily,
  getTaskHistoryForChild,
  getMyTaskHistory,
  // updateTaskByChild, // reserved for future edits from history if needed
} from '../api/firebaseTasks';
import './TaskHistoryPage.css';

function TaskHistoryPage() {
  const { user, loading } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);

  const isParent = user?.role === 'PARENT';
  const isChild = user?.role === 'CHILD';

  // Load children for parents
  useEffect(() => {
    const loadChildrenForParent = async () => {
      if (!isParent || !user?.familyId || !user?.token) return;
      try {
        const familyChildren = await getKidsByFamily(user.familyId, user.token);
        setChildren(familyChildren);
      } catch (e) {
        console.error('Failed to load children for history page', e);
        setError('Failed to load children list.');
      }
    };

    loadChildrenForParent();
  }, [isParent, user]);

  const loadHistory = async (targetChildId = null) => {
    if (!user?.token) return;
    setLoadingHistory(true);
    setError('');
    try {
      let data = [];
      if (isParent && targetChildId) {
        data = await getTaskHistoryForChild(targetChildId, user.token);
      } else if (isChild) {
        data = await getMyTaskHistory(user.token);
      }

      // Ensure sorted by lastUpdateDate descending if backend didn't already
      const sorted = [...data].sort((a, b) => {
        const aDate = a.lastUpdateDate || a.lastUpdatedDate || a.updatedAt || a.createdAt || 0;
        const bDate = b.lastUpdateDate || b.lastUpdatedDate || b.updatedAt || b.createdAt || 0;
        return new Date(bDate) - new Date(aDate);
      });

      setHistory(sorted);
    } catch (e) {
      console.error('Failed to load task history', e);
      setError('Failed to load task history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  // For child, load own history on mount
  useEffect(() => {
    if (isChild && user?.token) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChild, user?.token]);

  const handleChildChange = async (e) => {
    const value = e.target.value;
    setSelectedChildId(value);
    if (value) {
      await loadHistory(value);
    } else {
      setHistory([]);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleString();
    } catch {
      return String(value);
    }
  };

  if (loading) {
    return (
      <div className="task-history-page">
        <div className="task-history-loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="task-history-page">
        <div className="task-history-message task-history-message-warning">
          Please log in to see task history.
        </div>
      </div>
    );
  }

  return (
    <div className="task-history-page">
      <h2 className="task-history-title">Task History</h2>

      {error && (
        <div className="task-history-message task-history-message-error">
          {error}
        </div>
      )}

      {isParent && (
        <div className="task-history-filters">
          <label htmlFor="task-history-child-select" className="task-history-label">
            Choose child:
          </label>
          <select
            id="task-history-child-select"
            className="task-history-select"
            value={selectedChildId}
            onChange={handleChildChange}
          >
            <option value="">-- Select a child --</option>
            {children.map((child) => (
              <option key={child.id || child.uid} value={child.id || child.uid}>
                {child.nickname || child.email || child.id || child.uid}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingHistory ? (
        <div className="task-history-loading">Loading history...</div>
      ) : (
        <div className="task-history-table-wrapper">
          {history.length === 0 ? (
            <p className="task-history-empty">
              No task history found{isParent && selectedChildId ? ' for this child.' : '.'}
            </p>
          ) : (
            <table className="task-history-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Time (min)</th>
                  <th>Child comment</th>
                  <th>Parent comment</th>
                  <th>Created</th>
                  <th>Submitted</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id || item.taskInstanceId}>
                    <td>{item.title || item.taskTitle || '-'}</td>
                    <td>{item.status || item.Status || '-'}</td>
                    <td>{item.minutesReward ?? item.screenTime ?? '-'}</td>
                    <td>{item.childComment || '-'}</td>
                    <td>{item.parentComment || '-'}</td>
                    <td>{formatDateTime(item.createdAt || item.created_at)}</td>
                    <td>{formatDateTime(item.submittedAt || item.submitted_at || item.completedAt || item.completed_at)}</td>
                    <td>{formatDateTime(item.lastUpdateDate || item.lastUpdatedDate || item.updatedAt || item.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskHistoryPage;

