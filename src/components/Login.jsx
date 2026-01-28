import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from '../api/firebaseAuth';

import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/firebaseUser'; 

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
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {info && <Alert variant="success">{info}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </FloatingLabel>

        <Button variant="primary" type="submit" className="w-100 mb-2">
          Log In
        </Button>
        <Button
          variant="link"
          type="button"
          className="w-100 p-0"
          onClick={handlePasswordReset}
        >
          Forgot your password?
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
