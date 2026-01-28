import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  ListGroup,
  Button
} from 'react-bootstrap';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import WeekDayPicker from './WeekDayPicker';

const weekDayNames = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

export default function WeeklyTable() {
  const {
    allFamilyTasks: tasks,
    weeklyAssignments,
    assignWeekly
  } = useTaskContext();

  // which task is currently assigning
  const [pickerTaskId, setPickerTaskId] = useState(null);

  return (
    <Container className="py-4">
      <Row>
        {/* Calendar view */}
        <Col>
          <CardGroup>
            {Object.entries(weekDayNames).map(([idx, name]) => {
              const slots = weeklyAssignments[idx] || {};
              return (
                <Card
                  key={idx}
                  bg="info"
                  text="light"
                  style={{ width: '14rem' }}
                  className="mb-3"
                >
                  <Card.Header>{name}</Card.Header>
                  <ListGroup variant="flush">
                    {Object.entries(slots)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([timeSlot, dayTasks]) => (
                        <ListGroup.Item key={timeSlot} className="d-flex flex-column">
                          <strong>{timeSlot}</strong>
                          {dayTasks.map(t => (
                            <TaskItem key={t.id} task={t} />
                          ))}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Card>
              );
            })}
          </CardGroup>
        </Col>

        {/* Task list + picker */}
        <Col lg={4}>
          <h5>Your Tasks</h5>
          <ListGroup>
            {tasks.map(task => (
              <ListGroup.Item key={task.id} className="d-flex flex-column">
                <TaskItem task={task} />

                <div className="mt-2">
                  <Button
                    size="sm"
                    onClick={() => setPickerTaskId(task.id)}
                  >
                    Assign Days
                  </Button>
                </div>

                {pickerTaskId === task.id && (
                  <div className="mt-2">
                    <WeekDayPicker
                      onDone={(days, time) => {
                        assignWeekly(task, days, time);
                        setPickerTaskId(null);
                      }}
                      onCancel={() => setPickerTaskId(null)}
                    />
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
