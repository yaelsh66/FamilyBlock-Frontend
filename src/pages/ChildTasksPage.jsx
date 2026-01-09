// src/pages/ChildTasksPage.jsx
import React, { useContext, useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import TaskDraggable from '../components/TaskDraggable';
import AmountBox from '../components/AmountBox';
import { useScreenTime } from '../context/ScreenTimeContext';
import { useTaskContext } from '../context/TaskContext';
import { getParentsByFamily, submitCompletion } from '../api/firebaseTasks';
import './ChildTasksPage.css'


function ChildTasksPage() {
  const { user, loading } = useAuth();
  const [parents, setParents] = useState([]);

  const {
    assignedTasks,
    availableTasks,
    reassignTaskOptimistic,
  } = useTaskContext();
  
  const { addToPendingScreenTime } = useScreenTime();
  const [error, setError] = useState('');

  const assignedTotal = assignedTasks.reduce((sum, task) => sum + (task.time || 0), 0);

  useEffect(() => {
      if (!user?.familyId || !user?.token) return;

      getParentsByFamily(user.familyId, user.token)
        .then(setParents)
        .catch((e) => {
          console.error('Error fetching parents', e);
        });
    }, [user]);


  const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  const assignedClone = [...assignedTasks];
  const availableClone = [...availableTasks];

  const sourceList =
    source.droppableId === 'assigned' ? assignedClone : availableClone;
  const destList =
    destination.droppableId === 'assigned' ? assignedClone : availableClone;

  const [movedTask] = sourceList.splice(source.index, 1);
  destList.splice(destination.index, 0, movedTask);

  const newAssignedTo =
    destination.droppableId === 'assigned'
      ? [...(movedTask.assignedTo || []), user.uid]
      : (movedTask.assignedTo || []).filter((uid) => uid !== user.uid);

  try {
    await reassignTaskOptimistic(movedTask.id, newAssignedTo, {
      newAssigned: assignedClone,
      newAvailable: availableClone,
    });
  } catch (err) {
    console.error('Failed to update assignment:', err);
    setError('Failed to update task assignment.');
  }
};

const handleComplete = async (task) => {
  // 1. Optimistically remove the task from assignedTasks immediately
  try {
    // Update UI instantly by removing user from task assignment locally
    const newAssignedTo = (task.assignedTo || []).filter(uid => uid !== user.uid);

    // Use optimistic UI update function from context (or fallback)
    await reassignTaskOptimistic(task.id, newAssignedTo, {
      newAssigned: assignedTasks.filter(t => t.id !== task.id),
      newAvailable: availableTasks, // assuming task doesn't move to available here
    });

    // 2. Call backend to submit completion
    await submitCompletion(task, user);

    // 3. Update pending screen time
    await addToPendingScreenTime(task.time);

    alert(`✅ Task "${task.title}" marked as completed! Waiting for approval.`);
  } catch (error) {
    console.error('Failed to mark task as completed:', error);
    alert('❌ Failed to complete task. Try again later.');

    // Optional: revert UI if needed (e.g., re-add task back)
    // Here you can refetch tasks or add the task back manually
  }
};



  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">🚫 Please log in.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">👦 {user.nickname}'s Tasks</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          <Col md={6}>
            
              <h4>Assigned Tasks</h4>
              <Droppable droppableId="assigned">
                {(provided) => (
                  <div className='task-column' ref={provided.innerRef} {...provided.droppableProps}>
                    {assignedTasks.map((task, idx) => (
                      <TaskDraggable
                        key={task.id}
                        task={task}
                        index={idx}
                        isAssigned={true}
                        onComplete={handleComplete}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
           
          </Col>

          <Col md={6}>
            
              <h4>Available Tasks</h4>
              <Droppable droppableId="available">
                {(provided) => (
                  <div className='task-column' ref={provided.innerRef} {...provided.droppableProps}>
                    {availableTasks.map((task, idx) => (
                      <TaskDraggable
                        key={task.id}
                        task={task}
                        index={idx}
                        isAssigned={false}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            
          </Col>
        </Row>
      </DragDropContext>

      <AmountBox
        label="Future Potential"
        time={assignedTotal}
        variant="info"
        size="large"
        icon="💡"
      />
    </Container>
  );
}

export default ChildTasksPage;
