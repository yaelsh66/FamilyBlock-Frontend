import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BackgroundWrapper = ({ children }) => {
  const { user } = useAuth();

  const getBackgroundColor = () => user?.backgroundColor || localStorage.getItem('backgroundColor') || '#ffffff';
  const getBackgroundImage = () => user?.backgroundImage || localStorage.getItem('backgroundImage') || '';

  const [color, setColor] = useState(getBackgroundColor());
  const [image, setImage] = useState(getBackgroundImage());

  useEffect(() => {
    setColor(getBackgroundColor());
    setImage(getBackgroundImage());
  }, [user]);

  return (
    <>
      {/* Background layer, fixed and full screen */}
      <div
        style={{
          backgroundColor: color,
          backgroundImage: image ? `url(${image})` : 'none',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
        }}
      />

      {/* Page content wrapper with top padding to offset fixed background */}
      <div style={{ paddingTop: '60px' }}>
        {children}
      </div>
    </>
  );
};

export default BackgroundWrapper;
