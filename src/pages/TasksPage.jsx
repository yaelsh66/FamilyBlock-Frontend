import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import TaskListCard from '../components/TaskListCard';
import TasksList from '../components/TasksList';
import AddTaskForm from './forms/AddTaskForm';
import './TasksPage.css';

function TasksPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  return (
    <div className="tasks-page-container">
      <div className="tasks-page-row">
        <div className="tasks-page-col">
          <div className="tasks-page-header">
            <h2 className="tasks-page-title">Tasks</h2>
            <Button 
              variant="success" 
              onClick={() => setShowAddTaskModal(true)}
              className="tasks-page-add-button"
            >
              ➕ Add Task
            </Button>
          </div>
          <TaskListCard>
            <TasksList />
          </TaskListCard>
        </div>
      </div>
      <AddTaskForm 
        show={showAddTaskModal} 
        onHide={() => setShowAddTaskModal(false)} 
      />
    </div>
  );
}

export default TasksPage;
