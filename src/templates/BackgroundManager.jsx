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

  const getInitialImage = () => {
    if (user?.uid) return user.backgroundImage || '';
    return localStorage.getItem('backgroundImage') || '';
  };

  const [backgroundColor, setBackgroundColor] = useState(getInitialColor);
  const [backgroundImage, setBackgroundImage] = useState(getInitialImage);
  const [uploading, setUploading] = useState(false);

  // Apply background to <body> on change or login/logout
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor || 'transparent';
    document.body.style.backgroundImage = backgroundImage ? `url(${backgroundImage})` : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }, [backgroundColor, backgroundImage, user]);

  // Save to Firebase (if logged in) or localStorage (if logged out)
  const saveBackground = async (updates) => {
    const newColor = updates.backgroundColor ?? backgroundColor;
    const newImage = updates.backgroundImage ?? backgroundImage;

    setBackgroundColor(newColor);
    setBackgroundImage(newImage);

    if (user?.uid && user?.token) {
      try {
        await updateUserData(user.uid, updates, user.token);
        dispatch({
          type: 'UPDATE_BACKGROUND',
          payload: {
            backgroundColor: newColor,
            backgroundImage: newImage,
          },
        });
      } catch (err) {
        console.error('❌ Failed to update background in Firestore:', err);
      }
    } else {
      // Not logged in: store locally
      if (updates.backgroundColor !== undefined) {
        if (updates.backgroundColor) {
          localStorage.setItem('backgroundColor', updates.backgroundColor);
        } else {
          localStorage.removeItem('backgroundColor');
        }
      }
      if (updates.backgroundImage !== undefined) {
        if (updates.backgroundImage) {
          localStorage.setItem('backgroundImage', updates.backgroundImage);
        } else {
          localStorage.removeItem('backgroundImage');
        }
      }
    }
  };

  const handleColorChange = async (e) => {
    await saveBackground({ backgroundColor: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onloadend = async () => {
      const imageDataUrl = reader.result;
      await saveBackground({ backgroundImage: imageDataUrl });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    await saveBackground({ backgroundImage: '' });
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
          disabled={uploading}
          style={{ width: '100%', height: '2.5rem', cursor: 'pointer' }}
        />
        {backgroundColor && (
          <button
            className="btn btn-sm btn-outline-light mt-2"
            onClick={handleDeleteColor}
            disabled={uploading}
          >
            Remove Color
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label d-block">Background Image:</label>
        {backgroundImage ? (
          <div className="mb-2" style={{ maxHeight: 150, overflow: 'hidden' }}>
            <img
              src={backgroundImage}
              alt="Background preview"
              style={{ width: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="mb-2 text-muted">No image selected.</div>
        )}

        <label
          htmlFor="image-upload"
          className="btn btn-light me-2"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
        >
          {uploading ? 'Uploading...' : 'Choose Image'}
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {backgroundImage && (
          <button
            className="btn btn-sm btn-outline-light"
            onClick={handleDeleteImage}
            disabled={uploading}
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

export default BackgroundManager;
