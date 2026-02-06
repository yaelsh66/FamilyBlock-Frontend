import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserData, getUserData } from '../api/firebaseUser';
import { getKidsByFamily } from '../api/firebaseTasks';
import { getDailyTimeApi, getScheduleTimesApi } from '../api/timeControlApi';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from '../api/firebaseAuth';
import NewDeviceModal from '../components/NewDeviceModal';
import './Profile.css';

function Profile() {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [showParentLoginModal, setShowParentLoginModal] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentLoginError, setParentLoginError] = useState('');
  const [loggingInParent, setLoggingInParent] = useState(false);
  const [showNewDeviceModal, setShowNewDeviceModal] = useState(false);
  const [parentUserForDevice, setParentUserForDevice] = useState(null);
  const [dailyTimes, setDailyTimes] = useState([]);
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [loadingTimeSettings, setLoadingTimeSettings] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Only fetch children if user is a PARENT
    if (user.role === 'PARENT' && user.familyId) {
      setLoadingChildren(true);
      const fetchChildren = async () => {
        try {
          const familyChildren = await getKidsByFamily(user.familyId, user.token);
          setChildren(familyChildren || []);
        } catch (e) {
          console.error('Failed to load children', e);
          setChildren([]);
        } finally {
          setLoadingChildren(false);
        }
      };
      fetchChildren();
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'CHILD') return;
    const childId = user.id || user.uid;
    if (!childId || !user.token) return;

    const fetchTimeSettings = async () => {
      setLoadingTimeSettings(true);
      try {
        const [dailyList, scheduleList] = await Promise.all([
          getDailyTimeApi(childId, user.token),
          getScheduleTimesApi(childId, user.token),
        ]);
        setDailyTimes(dailyList || []);
        setScheduleTimes(scheduleList || []);
      } catch (e) {
        console.error('Failed to load time settings', e);
        setDailyTimes([]);
        setScheduleTimes([]);
      } finally {
        setLoadingTimeSettings(false);
      }
    };
    fetchTimeSettings();
  }, [user]);

  const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-alert profile-alert-warning">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  const handleOpenAddDevice = () => {
    // Only children can trigger this flow
    if (user.role !== 'CHILD') return;
    setParentEmail('');
    setParentPassword('');
    setParentLoginError('');
    setShowParentLoginModal(true);
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    setParentLoginError('');
    setLoggingInParent(true);

    try {
      const data = await signInWithEmailAndPassword(parentEmail, parentPassword);
      const userData = await getUserData(data.localId, data.idToken);
      const role = userData.role || '';

      if (role !== 'PARENT') {
        setParentLoginError('This account is not a parent account.');
        setLoggingInParent(false);
        return;
      }

      const parentUser = {
        uid: data.localId,
        email: data.email,
        token: data.idToken,
        refreshToken: data.refreshToken,
        role,
        familyId: userData.familyId || '',
        backgroundColor: userData.backgroundColor || '',
        totalTime: userData.totalTime || 0,
        pendingTime: userData.pendingTime || 0,
        nickname: userData.nickname || '',
        name: userData.name || '',
      };

      setParentUserForDevice(parentUser);
      setShowParentLoginModal(false);
      setShowNewDeviceModal(true);
      setLoggingInParent(false);
    } catch (err) {
      console.error('Parent login failed:', err);
      setParentLoginError('Login failed. Please check the credentials.');
      setLoggingInParent(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserData(user.uid, { nickname, name }, user.token);
      
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: { nickname, name },
      });

      // Update localStorage
      const updatedUser = {
        ...user,
        nickname,
        name,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handleCancel = () => {
    setNickname(user?.nickname || '');
    setName(user?.name || '');
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>👤 Profile</h2>
          </div>
          <div className="profile-body">
            {message.text && (
              <div
                className={`profile-alert profile-alert-${message.type}`}
                role="alert"
              >
                <button
                  type="button"
                  className="profile-alert-close"
                  onClick={() => setMessage({ type: '', text: '' })}
                  aria-label="Close"
                >
                  ×
                </button>
                <span>{message.text}</span>
              </div>
            )}

            <div className="profile-info">
              <div className="profile-field">
                <label className="profile-label">Email:</label>
                <div className="profile-value">{user.email}</div>
              </div>

              {/* Children Section - Only for Parents */}
              {user.role === 'PARENT' && (
                <>
                  <div className="profile-divider"></div>
                  <div className="profile-field">
                    <label className="profile-label">👨‍👩‍👧‍👦 My Children:</label>
                    {loadingChildren ? (
                      <div className="profile-value">Loading...</div>
                    ) : children.length === 0 ? (
                      <div className="profile-value">No children found</div>
                    ) : (
                      <div className="profile-children-list">
                        {children.map((child) => (
                          <div
                            key={child.id || child.uid}
                            className="profile-child-wrapper"
                          >
                            <div className="profile-child-card">
                              <div className="profile-child-body">
                                <div className="profile-child-info">
                                  <div className="profile-child-name">
                                    {child.nickname ||
                                      child.email ||
                                      'Unnamed Child'}
                                  </div>
                                  {child.email &&
                                    child.email !== (child.nickname || '') && (
                                      <div className="profile-child-email">
                                        {child.email}
                                      </div>
                                    )}
                                  <div className="profile-child-id">
                                    ID: {child.id || child.uid}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="profile-button profile-button-primary profile-device-button"
                              onClick={() =>
                                navigate(`/device/${child.id || child.uid}`)
                              }
                            >
                              Device
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="profile-field">
                <label className="profile-label">Role:</label>
                <div className="profile-value">
                  {user.role === 'PARENT'
                    ? '👨‍👩‍👧‍👦 Parent'
                    : '👦 Child'}
                </div>
              </div>

              {/* Child: Add Device with Parent Approval */}
              {user.role === 'CHILD' && (
                <div className="profile-field">
                  <button
                    type="button"
                    className="profile-button profile-button-primary"
                    onClick={handleOpenAddDevice}
                  >
                    ➕ Add Device (Parent Approval)
                  </button>
                </div>
              )}

              {/* Child: Daily Time & Schedule (read-only) */}
              {user.role === 'CHILD' && (
                <>
                  <div className="profile-divider"></div>
                  <div className="profile-field profile-time-section">
                    <label className="profile-label profile-time-label">⏱️ My Screen Time Limits</label>
                    {loadingTimeSettings ? (
                      <div className="profile-value">Loading...</div>
                    ) : dailyTimes.length === 0 && scheduleTimes.length === 0 ? (
                      <div className="profile-value">No limits or schedules set by parent.</div>
                    ) : (
                      <div className="profile-time-settings">
                        {dailyTimes.length > 0 && (
                          <div className="profile-daily-times">
                            <h5 className="profile-time-subtitle">Daily Time Limits</h5>
                            <div className="profile-daily-times-grid">
                              <div className="profile-daily-times-days-row">
                                {weekDays.map((day) => (
                                  <div key={day} className="profile-daily-time-cell">
                                    <strong>{day.substring(0, 3)}</strong>
                                  </div>
                                ))}
                              </div>
                              <div className="profile-daily-times-values-row">
                                {weekDays.map((day) => {
                                  const dayEntries = dailyTimes.filter(
                                    (dt) => dt.days && dt.days.includes(day)
                                  );
                                  return (
                                    <div key={day} className="profile-daily-time-cell profile-daily-time-value">
                                      {dayEntries.length > 0 ? (
                                        dayEntries.map((dt, i) => (
                                          <div key={i}>{dt.time || 0} min</div>
                                        ))
                                      ) : (
                                        <div>-</div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                        {scheduleTimes.length > 0 && (
                          <div className="profile-schedule-times">
                            <h5 className="profile-time-subtitle">Blocked Time Slots</h5>
                            <div className="profile-schedule-time-list">
                              {scheduleTimes.map((st, index) => (
                                <div key={index} className="profile-schedule-time-item">
                                  <div><strong>Days:</strong> {st.days?.join(', ') || 'None'}</div>
                                  <div><strong>Start:</strong> {st.startTime || st.start || '-'}</div>
                                  <div><strong>End:</strong> {st.endTime || st.end || '-'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {isEditing ? (
                <>
                  <div className="profile-field">
                    <label className="profile-label" htmlFor="nickname">
                      Nickname:
                    </label>
                    <input
                      id="nickname"
                      className="profile-input"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname"
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label" htmlFor="name">
                      Name:
                    </label>
                    <input
                      id="name"
                      className="profile-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="profile-actions">
                    <button
                      type="button"
                      className="profile-button profile-button-success"
                      onClick={handleSave}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      type="button"
                      className="profile-button profile-button-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-field">
                    <label className="profile-label">Nickname:</label>
                    <div className="profile-value">
                      {user.nickname || 'Not set'}
                    </div>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">Name:</label>
                    <div className="profile-value">
                      {user.name || 'Not set'}
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button
                      type="button"
                      className="profile-button profile-button-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parent Login Modal for approving device addition */}
      {user.role === 'CHILD' && showParentLoginModal && (
        <div className="profile-modal-backdrop" role="dialog" aria-modal="true">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Parent Approval Required</h3>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => {
                  setShowParentLoginModal(false);
                  setParentLoginError('');
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="profile-modal-body" onSubmit={handleParentLogin}>
              {parentLoginError && (
                <div className="profile-alert profile-alert-danger">
                  <button
                    type="button"
                    className="profile-alert-close"
                    onClick={() => setParentLoginError('')}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <span>{parentLoginError}</span>
                </div>
              )}
              <p className="profile-modal-text">
                A parent must sign in to approve adding a new device.
              </p>
              <div className="profile-field">
                <label className="profile-label" htmlFor="parentEmail">
                  Parent Email
                </label>
                <input
                  id="parentEmail"
                  className="profile-input"
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                />
              </div>
              <div className="profile-field">
                <label className="profile-label" htmlFor="parentPassword">
                  Password
                </label>
                <input
                  id="parentPassword"
                  className="profile-input"
                  type="password"
                  placeholder="Password"
                  value={parentPassword}
                  onChange={(e) => setParentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="profile-button profile-button-secondary"
                  onClick={() => {
                    setShowParentLoginModal(false);
                    setParentLoginError('');
                  }}
                  disabled={loggingInParent}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-button profile-button-primary"
                  disabled={loggingInParent}
                >
                  {loggingInParent ? 'Signing in...' : 'Sign in as Parent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Device Modal, uses parent token but child ID */}
      {user.role === 'CHILD' && parentUserForDevice && (
        <NewDeviceModal
          show={showNewDeviceModal}
          onHide={() => setShowNewDeviceModal(false)}
          childId={user.id}
          user={parentUserForDevice}
        />
      )}
    </div>
  );
}

export default Profile;
