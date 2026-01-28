import React from 'react';
import './TaskListCard.css';

const TaskListCard = ({ title, children }) => (
  <div className="task-list-card">
    <h5 className="task-list-card-header">
      {title}
    </h5>

    <div className="task-list-card-body">
      {children}
    </div>
  </div>
);

export default TaskListCard;
