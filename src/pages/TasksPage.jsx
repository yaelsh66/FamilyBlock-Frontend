import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TaskListCard from '../components/TaskListCard';
import TasksList from '../components/TasksList';

function TasksPage() {
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <TaskListCard title="Tasks">
            <TasksList />
          </TaskListCard>
        </Col>
      </Row>
    </Container>
  );
}

export default TasksPage;
