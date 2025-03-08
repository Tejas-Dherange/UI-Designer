import React, { useState, useEffect } from 'react';
import { Component, ComponentType } from '../types/component';
import { useComponentStore } from '../store/componentStore';
import { ComponentRenderer } from './ComponentRenderer';

interface CanvasProps {
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

export const Canvas: React.FC<CanvasProps> = ({ viewMode }) => {
  const { components, addComponent, selectComponent, selectedComponentId, updateComponent } = useComponentStore();
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  // Effect to load current theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('canvasTheme') || 'default';
    setCurrentTheme(savedTheme);
  }, []);

  // Canvas width based on selected view mode
  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'desktop': return 'w-full max-w-6xl';
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[375px]';
      default: return 'w-full';
    }
  };

  // Handle component drop (drag & drop)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    const imageUrl = e.dataTransfer.getData('imageUrl'); 

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Convert to percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Convert to percentage

    const newComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type: componentType as ComponentType,
      isVisible: true, // Ensure new components are visible by default
      props: {
        style: {
          position: 'absolute',
          left: `${x}%`, 
          top: `${y}%`,
          width: componentType === 'navbar' ? '100%' : '50%', 
          height: 'auto',
        },
        className: 'responsive-component',
        children: componentType === 'text' ? 'Text Component' : '',
        src: imageUrl || 'https://via.placeholder.com/150',
      }
    };

    addComponent(newComponent);
    selectComponent(newComponent.id);
  };

  // Allow dragging over canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    selectComponent(id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDraggingComponent(id);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingComponent) return;

    const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - canvasRect.left - offset.x) / canvasRect.width) * 100;
    const y = ((e.clientY - canvasRect.top - offset.y) / canvasRect.height) * 100;

    updateComponent(draggingComponent, {
      props: {
        ...components.find(c => c.id === draggingComponent)?.props,
        style: {
          ...((components.find(c => c.id === draggingComponent)?.props.style) || {}),
          left: `${x}%`,
          top: `${y}%`,
        },
      },
    });
  };

  const handleMouseUp = () => {
    setDraggingComponent(null);
  };

  return (
    <div
      className={`canvas-container bg-white border border-gray-300 shadow-sm h-[calc(100vh-12rem)] ${getCanvasWidth()} relative overflow-y-auto overflow-x-hidden theme-${currentTheme}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="font-medium">Drag and drop components here</p>
            <p className="text-sm mt-2">or select a template to get started</p>
          </div>
        </div>
      )}

      {components.map((component: Component) => (
        (!component.hasOwnProperty('isVisible') || component.isVisible) && ( // Only render if isVisible is not defined or true
          <div 
            key={component.id}
            onMouseDown={(e) => handleMouseDown(e, component.id)}
            className={`absolute cursor-pointer ${selectedComponentId === component.id ? 'outline outline-2 outline-blue-500' : ''}`}
            style={{
              left: component.props.style?.left || '0%',
              top: component.props.style?.top || '0%',
              width: component.props.style?.width || 'auto',
              height: component.props.style?.height || 'auto',
              zIndex: selectedComponentId === component.id ? 10 : 1,
            }}
          >
            <ComponentRenderer component={component} />
          </div>
        )
      ))}
    </div>
  );
};