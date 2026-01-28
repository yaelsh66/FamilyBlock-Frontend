import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserData } from '../api/firebaseUser';

function BackgroundManager() {
  const { user, dispatch } = useAuth();

  // Initialize state: prefer user, fallback to localStorage
  const getInitialColor = () => {
    if (user?.uid) return user.backgroundColor || '';
    return localStorage.getItem('backgroundColor') || '';
  };

  const [backgroundColor, setBackgroundColor] = useState(getInitialColor);

  // Apply background to <body> on change or login/logout
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor || 'transparent';
  }, [backgroundColor, user]);

  // Save to Firebase (if logged in) or localStorage (if logged out)
  const saveBackground = async (updates) => {
    const newColor = updates.backgroundColor ?? backgroundColor;

    setBackgroundColor(newColor);

    if (user?.uid && user?.token) {
      try {
        await updateUserData(user.uid, updates, user.token);
        dispatch({
          type: 'UPDATE_BACKGROUND',
          payload: { backgroundColor: newColor },
        });
      } catch (err) {
        console.error('❌ Failed to update background in Firestore:', err);
      }
    } else {
      if (updates.backgroundColor !== undefined) {
        if (updates.backgroundColor) {
          localStorage.setItem('backgroundColor', updates.backgroundColor);
        } else {
          localStorage.removeItem('backgroundColor');
        }
      }
    }
  };

  const handleColorChange = async (e) => {
    await saveBackground({ backgroundColor: e.target.value });
  };

  const handleDeleteColor = async () => {
    await saveBackground({ backgroundColor: '' });
  };

  return (
    <div className="p-3 bg-dark text-white">
      <h4 className="mb-3">Customize Background</h4>

      <div className="mb-3">
        <label htmlFor="color-picker" className="form-label">
          Background Color:
        </label>
        <input
          id="color-picker"
          type="color"
          value={backgroundColor || '#ffffff'}
          onChange={handleColorChange}
          style={{ width: '100%', height: '2.5rem', cursor: 'pointer' }}
        />
        {backgroundColor && (
          <button
            className="btn btn-sm btn-outline-light mt-2"
            onClick={handleDeleteColor}
          >
            Remove Color
          </button>
        )}
      </div>
    </div>
  );
}

export default BackgroundManager;
