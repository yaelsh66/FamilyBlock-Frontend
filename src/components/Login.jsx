import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from '../api/firebaseAuth';

import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/firebaseUser'; 
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setInfo('');

  try {
    // Step 1: REST login to get idToken and uid
    const data = await signInWithEmailAndPassword(email, password);

    
    // Step 3: Fetch user Firestore data (role, familyId)
    const userData = await getUserData(data.localId, data.idToken);
    const role = userData.role || '';
    const familyId = userData.familyId || '';
    const backgroundColor = userData.backgroundColor || '';
    const totalTime = userData.totalTime || 0;
    const pendingTime = userData.pendingTime || 0;
    const nickname = userData.nickname || '';
    const whatsAppNumber = userData.whatsAppNumber || '';
    
    const user = {
      id: userData.id,
      uid: data.localId,
      email: data.email,
      token: data.idToken,
      refreshToken: data.refreshToken,
      role,
      familyId,
      backgroundColor,
      totalTime,
      pendingTime,
      nickname,
      whatsAppNumber,
      name: userData.name || ''
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });

    if (role === 'PARENT') {
      navigate('/parent');
    } else if (role === 'CHILD') {
      navigate('/child');
    } else {
      navigate('/');
    }

  } catch (err) {
    console.error(err);
    setError('Login failed. Please check your credentials.');
  }
};

  const handlePasswordReset = async () => {
    setError('');
    setInfo('');

    if (!email) {
      setError('Please enter your email above before requesting a password reset.');
      return;
    }

    try {
      await sendPasswordResetEmail(email);
      setInfo('If this email is registered, a password reset link has been sent.');
    } catch (err) {
      const firebaseError = err?.response?.data?.error?.message;
      console.error('Password reset error:', firebaseError || err.message);
      setError('Could not send reset email. Please check the email and try again.');
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="login-alert login-alert-error">{error}</div>}
        {info && <div className="login-alert login-alert-info">{info}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
          <button
            type="button"
            className="login-link"
            onClick={handlePasswordReset}
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
