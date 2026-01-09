import React, { useState } from 'react';
import { Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';

// Playful yet clean TaskItem. Logic unchanged; UI tweaks: badge wraps, no 🎉 emoji on title.
export default function TaskItem({ task, isAssigned = false, onComplete, onStartUpdate }) {
  const { user } = useAuth();
  const { deleteTask } = useTaskContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!onStartUpdate) return;
    setLoading(true);
    setError('');
    try {
      await onStartUpdate(task.id, editedTask);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      setError('❌ Update failed. Try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setIsEditing(false);
    } catch (err) {
      console.error('Delete task failed:', err);
    }
  };

  return (
    <Card
      className="mb-3"
      style={{ borderRadius: '1rem', backgroundColor: '#fffde7' }}
      border="warning"
    >
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {isEditing ? (
          <>  
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                placeholder="Enter new title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Screen Time (minutes)</Form.Label>
              <Form.Control
                name="time"
                type="number"
                value={editedTask.time}
                onChange={handleChange}
                min={0}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : '💾 Save'}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-2"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                className="ms-2"
              >
                {loading ? <Spinner size="sm" animation="border" /> : '🗑️ Delete'}
              </Button>
            </div>
          </>
        ) : (
          <>  
            <div className="d-flex align-items-center mb-2 flex-wrap">
              <Card.Title className="flex-grow-1 mb-1">
                {task.title}
              </Card.Title>
              <Badge bg="info" pill className="ms-auto">
                ⏰ {task.time} min
              </Badge>
            </div>

            <Card.Text style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              {task.description}
            </Card.Text>

            <div className="d-flex gap-2">
              {isAssigned && onComplete && (
                <Button
                  variant="outline-success"
                  onClick={() => onComplete(task)}
                  size="sm"
                >
                  ✅ Complete
                </Button>
              )}

              {!isEditing && onStartUpdate && (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Update
                </Button>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
