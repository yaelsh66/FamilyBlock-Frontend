import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { signUpWithEmailAndPassword } from '../../api/firebaseAuth';
import { createUser } from '../../api/firebaseAuth';

function SignupFamily() {
  const [familyId, setFamilyId] = useState('');
  const [parents, setParents] = useState([{ email: '', password: '', name: '' }]);
  const [children, setChildren] = useState([{ email: '', password: '', name: '' }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (type) => {
    const update = type === 'parent' ? [...parents, { email: '', password: '', name: '' }] : [...children, { email: '', password: '', name: '' }];
    type === 'parent' ? setParents(update) : setChildren(update);
  };

  const handleChange = (type, index, field, value) => {
    const update = type === 'parent' ? [...parents] : [...children];
    update[index][field] = value;
    type === 'parent' ? setParents(update) : setChildren(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const allUsers = [
        ...parents.map(u => ({ ...u, role: 'parent' })),
        ...children.map(u => ({ ...u, role: 'child' })),
      ];

      for (let user of allUsers) {
        const authData = await signUpWithEmailAndPassword(user.email, user.password);
        await createUser({
          idToken: authData.idToken,
          role: user.role,
          familyName: familyId,
          name: user.name
        });

      }

      setMessage('Family signed up successfully!');
    } catch (err) {
      
      const firebaseError = err?.response?.data?.error?.message;
      console.error('Signup error:', firebaseError);
      setError(firebaseError || 'Signup failed. Please try again.');
      
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Sign Up a Family</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="familyId" className="mb-4">
          <Form.Label>Family ID (can be anything like "smith123")</Form.Label>
          <Form.Control
            type="text"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            required
          />
        </Form.Group>

        <h5>Parents</h5>
        {parents.map((parent, idx) => (
          <Row key={`parent-${idx}`} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Parent Name"
                value={parent.name}
                onChange={(e) => handleChange('parent', idx, 'name', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="email"
                placeholder="Parent Email"
                value={parent.email}
                onChange={(e) => handleChange('parent', idx, 'email', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="password"
                placeholder="Password"
                value={parent.password}
                onChange={(e) => handleChange('parent', idx, 'password', e.target.value)}
                required
              />
            </Col>
          </Row>
        ))}
        <Button variant="outline-secondary" onClick={() => handleAdd('parent')} className="mb-4">
          + Add Parent
        </Button>

        <h5>Children</h5>
        {children.map((child, idx) => (
          <Row key={`child-${idx}`} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Child Name"
                value={child.name}
                onChange={(e) => handleChange('child', idx, 'name', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="email"
                placeholder="Child Email"
                value={child.email}
                onChange={(e) => handleChange('child', idx, 'email', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="password"
                placeholder="Password"
                value={child.password}
                onChange={(e) => handleChange('child', idx, 'password', e.target.value)}
                required
              />
            </Col>
          </Row>
        ))}
        <Button variant="outline-secondary" onClick={() => handleAdd('child')} className="mb-4">
          + Add Child
        </Button>

        <Button variant="primary" type="submit" className="w-100">
          Sign Up Family
        </Button>
      </Form>
    </Container>
  );
}

export default SignupFamily;