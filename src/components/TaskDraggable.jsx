// src/components/TaskDraggable.jsx
import { Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';

function TaskDraggable({ task, index, isAssigned, onComplete }) {

  const getColor = (isDragging) => {
    if(isDragging){
      return '#e9ecef'
    }
    if( isAssigned ){
      return '#f2f9d3ff';
    }
    return '#d0ebff';
    
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="list-group-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: getColor(snapshot.isDragging),
            marginBottom: '8px',
            padding: '8px',
            border: '1px solid #dee2e6',
            borderRadius: '0.25rem',
          }}
        >
          <TaskItem
            task={task}
            isAssigned={isAssigned}
            onComplete={onComplete}  // ✅ pass the complete handler
          />
        </div>
      )}
    </Draggable>
  );
}

export default TaskDraggable;
