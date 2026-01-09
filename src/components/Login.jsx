import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from '../api/firebaseAuth';

import { useAuth } from '../context/AuthContext';
import { getUserTimeData } from '../api/firebaseUser'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // Step 1: REST login to get idToken and uid
    const data = await signInWithEmailAndPassword(email, password);

    
    // Step 3: Fetch user Firestore data (role, familyId)
    const userData = await getUserTimeData(data.localId, data.idToken);
    const role = userData.role?.stringValue || '';
    const familyId = userData.familyId?.stringValue || '';
    const backgroundImage  = userData.backgroundImage?.stringValue || '';
    const backgroundColor = userData.backgroundColor?.stringValue || '';
    const totalTime = userData.totalTime?.doubleValue || 0;
    const pendingTime = userData.pendingTime?.doubleValue || 0;
    const nickname = userData.nickname?.stringValue || '';
    const whatsAppNumber = userData.whatsAppNumber || '';

    const user = {
      uid: data.localId,
      email: data.email,
      token: data.idToken,
      refreshToken: data.refreshToken,
      role,
      familyId,
      backgroundImage ,
      backgroundColor,
      totalTime,
      pendingTime,
      nickname,
      whatsAppNumber,
    };

    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });

    if (role === 'parent') {
      navigate('/parent');
    } else if (role === 'child') {
      navigate('/child');
    } else {
      navigate('/');
    }

  } catch (err) {
    console.error(err);
    setError('Login failed. Please check your credentials.');
  }
};


  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

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

        <Button variant="primary" type="submit" className="w-100">
          Log In
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
