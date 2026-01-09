import React from 'react';
import { Card } from 'react-bootstrap';

const TaskListCard = ({ title, children }) => (
  <Card
    className="shadow rounded-4"
    style={{
      maxHeight: 'calc(100vh - 100px)', // Allow it to grow, but limit max height
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    <Card.Header
      as="h5"
      className="bg-primary text-white fw-semibold rounded-top-4"
      style={{ flexShrink: 0 }}
    >
      {title}
    </Card.Header>

    <Card.Body
      style={{
        overflowY: 'auto',
        flex: 1,
        paddingRight: '1rem',
      }}
    >
      {children}
    </Card.Body>
  </Card>
);

export default TaskListCard;
