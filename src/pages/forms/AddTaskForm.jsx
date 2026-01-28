import React, { useState, useEffect } from 'react';
import { Form, Button, FloatingLabel, Container, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

import { useTaskContext } from '../../context/TaskContext';

function AddTaskForm({ show, onHide }) {
  const { user, loading } = useAuth();  // ✅ Include loading state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const { addTask} = useTaskContext();

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setTitle('');
      setDescription('');
      setAmount('');
      setSuccess(false);
    }
  }, [show]);

  const isModal = show !== undefined && onHide !== undefined;

  if (loading) {
    return isModal ? null : (
      <Container className="mt-5 text-center">
        <h4>Loading...</h4>
      </Container>
    );
  }

  if (!user) {
    return isModal ? null : (
      <Container className="mt-5">
        <Alert variant="warning">🚫 You must be logged in to add tasks.</Alert>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    const task = {
      title,
      description,
      time: parseFloat(time) || 0,
      createdBy: user.uid,
      

    };

    try {
      await addTask(task, user.token);
      setTitle('');
      setDescription('');
      setAmount('');
      setSuccess(true);
      
      // Close modal after successful submission
      if (isModal) {
        setTimeout(() => {
          if (onHide) onHide();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setSuccess(false);
    if (onHide) onHide();
  };

  const formContent = (
    <>
      <FloatingLabel label="Task Title" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Walk the dog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel label="Comment" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Describe the task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ height: '100px' }}
        />
      </FloatingLabel>

      
        <FloatingLabel label="Reward Screen Time (minutes)" className="mb-3">
          <Form.Control
            type="number"
            placeholder="Amount in shekels"
            value={time}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="1"
          />
        </FloatingLabel>
      
    </>
  );

  // Render as Modal if show/onHide props are provided
  if (isModal) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>📝 Add New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formContent}
            {success && <p className="mt-3 text-success">✅ Task added successfully!</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  // Render as page component (backward compatibility)
  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">📝 Add New Task</h2>
      <Form onSubmit={handleSubmit}>
        {formContent}
        <Button type="submit" variant="success" className="w-100">Add Task</Button>
        {success && <p className="mt-3 text-success">✅ Task added successfully!</p>}
      </Form>
    </Container>
  );
}

export default AddTaskForm;
