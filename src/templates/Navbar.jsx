// src/templates/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useScreenTime } from '../context/ScreenTimeContext';
import { updateUserData } from '../api/firebaseUser';
import AmountBox from '../components/AmountBox';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ColorSchemesExample() {
  const { user, dispatch } = useAuth();
  const { totalScreenTime, pendingScreenTime } = useScreenTime();
  const navigate = useNavigate();

  const [backgroundColor, setBackgroundColor] = useState(
    user?.backgroundColor || localStorage.getItem('backgroundColor') || '#ffffff'
  );
  const [backgroundImage, setBackgroundImage] = useState(
    user?.backgroundImage || localStorage.getItem('backgroundImage') || ''
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBackgroundImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('backgroundImage', backgroundImage);
    if (user?.uid && user?.token) {
      await updateUserData(user.uid, { backgroundColor, backgroundImage }, user.token);
      dispatch({ type: 'UPDATE_BACKGROUND', payload: { backgroundColor, backgroundImage } });
    }
  };

  const handleDelete = async () => {
    setBackgroundColor('#ffffff');
    setBackgroundImage('');
    localStorage.removeItem('backgroundColor');
    localStorage.removeItem('backgroundImage');
    if (user?.uid && user?.token) {
      await updateUserData(user.uid, { backgroundColor: '', backgroundImage: '' }, user.token);
      dispatch({ type: 'UPDATE_BACKGROUND', payload: { backgroundColor: '', backgroundImage: '' } });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem(user);
    navigate('/');
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'parent') return '/parent';
    if (user.role === 'child') return '/child';
    return '/';
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Nav className="me-auto">
          {user && (
            <>
              <Nav.Link as={Link} to={getHomeLink()}>My Home</Nav.Link>
              <Nav.Link as={Link} to="/newtask">New Task</Nav.Link>
              <Nav.Link as={Link} to="/tastsList">Tasks</Nav.Link>
            </>
          )}
          {!user && (
            <>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          )}

          
            <NavDropdown title="🎉 Fun Time" id="funtime-dropdown" className="ms-3">
  {/* 🎮 Brawl Game */}
  <NavDropdown.Item
    as={Link}
    to="/brawl"
    className="fw-bold text-success"
    style={{ fontSize: '1rem' }}
  >
    🕹️ Play Brawl Game
  </NavDropdown.Item>

  <NavDropdown.Divider />

  {/* 🎨 Background Settings */}
  <NavDropdown.Header className="text-primary">🎨 Background Settings</NavDropdown.Header>

  <Form className="px-3 pt-2">
    <Form.Label className="small mb-1">Choose Color:</Form.Label>
    <Form.Control
      type="color"
      value={backgroundColor}
      onChange={(e) => setBackgroundColor(e.target.value)}
    />
  </Form>

  <Form className="px-3 pt-3">
    <Form.Label className="small mb-1">Upload Image:</Form.Label>
    <Form.Control
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />
  </Form>

  <div className="d-flex justify-content-between px-3 py-3">
    <Button size="sm" variant="success" onClick={handleSave} disabled={!user?.uid}>
      💾 Save
    </Button>
    <Button size="sm" variant="outline-danger" onClick={handleDelete}>
      🗑️ Delete
    </Button>
  </div>

  {!user?.uid && (
    <small className="text-muted px-3 pb-2 d-block">
      Login to save settings permanently
    </small>
  )}

  {/* ⏱️ Screen Time for child */}
  {user?.role === 'child' && (
    <>
      <NavDropdown.Divider />
      <NavDropdown.Header className="text-primary">🕒 Screen Time</NavDropdown.Header>
      <div className="px-3 py-2">
        <AmountBox label="Used Time" time={totalScreenTime} />
        <AmountBox label="Pending Time" time={pendingScreenTime} />
      </div>
    </>
  )}

  <NavDropdown.Divider />

  {/* 🔓 Logout */}
  <div className="d-flex justify-content-center pb-3 px-3">
    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
      🔓 Logout
    </Button>
  </div>
</NavDropdown>

          
        </Nav>

        {user && (
          <div className="d-flex align-items-center text-white gap-3">
            <span>👋 Hi, {user.nickname || user.email}</span>
          </div>
        )}
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
