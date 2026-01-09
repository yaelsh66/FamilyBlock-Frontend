// src/components/DragDropWrapper.jsx
import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';

function DragDropWrapper({ onDragEnd, children }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
}

export default DragDropWrapper;
