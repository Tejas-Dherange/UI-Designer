"use client"
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ComponentItem {
  id: string;
  type: string;
  styles: Record<string, string>;
}

export function ComponentSection({ onDrop }: { onDrop: (component: ComponentItem) => void }) {
  const components = [
    { id: "1", type: "Button" },
    { id: "2", type: "Input" },
    { id: "3", type: "Card" },
  ];

  return (
    <div className="border p-4">
      <h2>Components</h2>
      {components.map((comp) => (
        <div key={comp.id} className="cursor-pointer p-2 border" onClick={() => onDrop({ ...comp, styles: {} })}>
          {comp.type}
        </div>
      ))}
    </div>
  );
}

export function DragDropSection({ components, onSelect }: { components: ComponentItem[]; onSelect: (component: ComponentItem) => void }) {
  return (
    <div className="border p-4 min-h-[200px]">
      <h2>Drag & Drop Section</h2>
      {components.map((comp) => (
        <div key={comp.id} className="p-2 border cursor-pointer" onClick={() => onSelect(comp)}>
          {comp.type}
        </div>
      ))}
    </div>
  );
}

export function StyleEditor({ component, onChange }: { component: ComponentItem | null; onChange: (styles: Record<string, string>) => void }) {
  if (!component) return <div className="border p-4">Select a component to edit styles</div>;

  return (
    <div className="border p-4">
      <h2>Style Editor</h2>
      <label>Background Color:</label>
      <input type="text" onChange={(e) => onChange({ ...component.styles, backgroundColor: e.target.value })} />
    </div>
  );
}

export function AIEditor({ component, onChange }: { component: ComponentItem | null; onChange: (styles: Record<string, string>) => void }) {
  if (!component) return <div className="border p-4">Select a component to edit with AI</div>;

  const applyAIStyle = () => {
    const newStyles = { backgroundColor: "#f0f0f0", fontSize: "16px" };
    onChange(newStyles);
  };

  return (
    <div className="border p-4">
      <h2>AI Editor</h2>
      <button onClick={applyAIStyle} className="border p-2">Apply AI Styles</button>
    </div>
  );
}

export default function EditorPage() {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleComponentDrop = (component: ComponentItem) => {
    setComponents((prev) => [...prev, component]);
  };

  const handleStyleChange = (styles: Record<string, string>) => {
    if (selectedComponent) {
      setComponents((prev) =>
        prev.map((comp) =>
          comp.id === selectedComponent.id ? { ...comp, styles } : comp
        )
      );
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <ComponentSection onDrop={handleComponentDrop} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={components} strategy={verticalListSortingStrategy}>
          <DragDropSection components={components} onSelect={setSelectedComponent} />
        </SortableContext>
      </DndContext>
      <StyleEditor component={selectedComponent} onChange={handleStyleChange} />
      <AIEditor component={selectedComponent} onChange={handleStyleChange} />
    </div>
  );
}
