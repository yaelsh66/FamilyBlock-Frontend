import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

import { useTaskContext } from '../../context/TaskContext';

function AddTaskForm() {
  const { user, loading } = useAuth();  // ✅ Include loading state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const { addTask} = useTaskContext();

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h4>Loading...</h4>
      </Container>
    );
  }

  if (!user) {
    return (
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
      familyId: user.familyId,
      createdBy: user.uid,
      

    };

    try {
      await addTask(task, user.token);
      setTitle('');
      setDescription('');
      setAmount('');
      setSuccess(true);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">📝 Add New Task</h2>
      <Form onSubmit={handleSubmit}>
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
        

        <Button type="submit" variant="success" className="w-100">Add Task</Button>
        {success && <p className="mt-3 text-success">✅ Task added successfully!</p>}
      </Form>
    </Container>
  );
}

export default AddTaskForm;
