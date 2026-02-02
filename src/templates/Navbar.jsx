// src/templates/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useScreenTime } from '../context/ScreenTimeContext';
import { useCompletions } from '../context/CompletionsContext';
import { updateUserData } from '../api/firebaseUser';
import AmountBox from '../components/AmountBox';
import './Navbar.css';

function ColorSchemesExample() {
  const { user, dispatch } = useAuth();
  const { totalScreenTime, pendingScreenTime } = useScreenTime();
  const { completions } = useCompletions();
  const navigate = useNavigate();

  const [backgroundColor, setBackgroundColor] = useState(
    user?.backgroundColor || localStorage.getItem('backgroundColor') || '#ffffff'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Use a small delay to avoid immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSave = async () => {
    localStorage.setItem('backgroundColor', backgroundColor);
    if (user?.uid && user?.token) {
      await updateUserData(user.uid, { backgroundColor }, user.token);
      dispatch({ type: 'UPDATE_BACKGROUND', payload: { backgroundColor } });
    }
  };

  const handleDelete = async () => {
    setBackgroundColor('#ffffff');
    localStorage.removeItem('backgroundColor');
    if (user?.uid && user?.token) {
      await updateUserData(user.uid, { backgroundColor: '' }, user.token);
      dispatch({ type: 'UPDATE_BACKGROUND', payload: { backgroundColor: '' } });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
    navigate('/');
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'PARENT') return '/parent';
    if (user.role === 'CHILD') return '/child';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getHomeLink()} className="navbar-brand">Home</Link>
        
        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {user && (
              <>
                <Link to="/tasksList" className="nav-link" onClick={() => setIsMenuOpen(false)}>Tasks</Link>
                {user.role === 'CHILD' && (
                  <Link to="/child/tasks" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Tasks</Link>
                )}
                {user.role === 'PARENT' && (
                  <>
                    <Link to="/parent/approval" className="nav-link approval-link" onClick={() => setIsMenuOpen(false)}>
                      Approval
                      {completions && completions.length > 0 && (
                        <span className="approval-badge">{completions.length}</span>
                      )}
                    </Link>
                  </>
                )}
                <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/signup" className="nav-link" onClick={() => setIsMenuOpen(false)}>Signup</Link>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </>
            )}

            <div className="dropdown" ref={dropdownRef}>
              <button 
                className="dropdown-toggle"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDropdownOpen(prev => !prev);
                }}
              >
                🎉 Fun Time
              </button>
              {isDropdownOpen && (
                <div 
                  className="dropdown-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ display: 'block' }}
                >
                  {/* 🎮 Brawl Game */}
                  <Link 
                    to="/brawl" 
                    className="dropdown-item"
                    style={{ color: '#003366', opacity: 1, visibility: 'visible' }}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span style={{ color: '#003366', display: 'inline' }}>🕹️ Play Brawl Game</span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  {/* 🎨 Background Settings */}
                  <div className="dropdown-header">🎨 Background Settings</div>

                  <div className="dropdown-form">
                    <label className="form-label">Choose Color:</label>
                    <input
                      type="color"
                      className="form-control"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                  </div>

                  <div className="dropdown-buttons">
                    <button 
                      className="btn btn-success" 
                      onClick={handleSave} 
                      disabled={!user?.uid}
                    >
                      💾 Save
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={handleDelete}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {!user?.uid && (
                    <small className="dropdown-hint">
                      Login to save settings permanently
                    </small>
                  )}

                  {/* ⏱️ Screen Time for child */}
                  {user?.role === 'child' && (
                    <>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-header">🕒 Screen Time</div>
                      <div className="dropdown-screen-time">
                        <AmountBox label="Used Time" time={totalScreenTime} />
                        <AmountBox label="Pending Time" time={pendingScreenTime} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Logout button - appears in nav on mobile, in navbar-user on desktop */}
            {user && (
              <button 
                className="nav-link nav-link-logout" 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                🔓 Logout
              </button>
            )}
          </div>

          {user && (
            <div className="navbar-user">
              <span>👋 Hi, {user.nickname || user.email}</span>
              <button 
                className="btn btn-outline-danger navbar-logout-btn" 
                onClick={handleLogout}
              >
                🔓 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default ColorSchemesExample;
