import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Component } from "../types/component";

interface ComponentStore {
  components: Component[];
  selectedComponentId: string | null;
  history: Component[][];
  future: Component[][];
  previousComponents: Component[]; // From second file
  addComponent: (component: Omit<Component, "id">) => void;
  updateComponent: (id: string, updatedProps: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  setComponents: (newComponents: Component[]) => void;
  applyAIAnalyzer: (updatedComponents: Partial<Component>[]) => void;
  toggleVisibility: (id: string) => void;
  duplicateComponent: (id: string) => void;
  undo: () => void;
  redo: () => void;
  undoChanges: () => void; // From second file
  deleteAllComponents: () => void;
  addToHistory: () => void;
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  components: [],
  selectedComponentId: null,
  history: [],
  future: [],
  previousComponents: [], // From second file

  addToHistory: () => {
    const { components, history } = get();
    set({ history: [...history, JSON.parse(JSON.stringify(components))], future: [] });
  },

  setComponents: (newComponents) => {
    get().addToHistory();
    set((state) => ({
      components: newComponents,
      previousComponents: [...state.components], // Also update previousComponents for second file's undo
    }));
  },

  selectComponent: (id) => set({ selectedComponentId: id }),
  
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),

  addComponent: (component) => {
    get().addToHistory();
    const newComponent = { 
      ...component, 
      id: uuidv4(),
      isVisible: true,
      position: { x: 0, y: 0 }
    };
    set((state) => ({ 
      components: [...state.components, newComponent], 
      selectedComponentId: newComponent.id,
      previousComponents: [...state.components], // For second file's undo
    }));
  },

  updateComponent: (id, updatedProps) => {
    get().addToHistory();
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updatedProps } : comp
      ),
      previousComponents: [...state.components], // For second file's undo
    }));
  },

  applyAIAnalyzer: (updatedComponents) => {
    get().addToHistory();
    set((state) => ({
      components: state.components.map((comp) => {
        const updatedComp = updatedComponents.find((u) => u.id === comp.id);
        return updatedComp
          ? { 
              ...comp, 
              ...updatedComp, 
              isVisible: true 
            }
          : { ...comp, isVisible: true };
      }),
      previousComponents: [...state.components], // For second file's undo
    }));
  },

  deleteComponent: (id) => {
    get().addToHistory();
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
      previousComponents: [...state.components], // For second file's undo
    }));
  },

  toggleVisibility: (id) => {
    get().addToHistory();
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, isVisible: !component.isVisible } : component
      ),
      previousComponents: [...state.components], // For second file's undo
    }));
  },

  duplicateComponent: (id) => {
    get().addToHistory();
    set((state) => {
      const original = state.components.find((c) => c.id === id);
      if (!original) return state;
  
      const duplicatedComponent = {
        ...original,
        id: uuidv4(),
        isVisible: true,
        position: {
          x: (original.position?.x || 0) + 20,
          y: (original.position?.y || 0) + 20,
        },
        props: {
          ...original.props,
          style: {
            ...(original.props?.style || {}),
            left: `${parseFloat(original.props?.style?.left || "0px") + 20}px`,
            top: `${parseFloat(original.props?.style?.top || "0px") + 20}px`,
          },
        },
      };
  
      return { 
        components: [...state.components, duplicatedComponent],
        previousComponents: [...state.components], // For second file's undo
      };
    });
  },
  
  undo: () => {
    const { history, future, components } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      components: previous,
      history: history.slice(0, -1),
      future: [JSON.parse(JSON.stringify(components)), ...future],
      previousComponents: [...components], // For second file's undo
    });
  },

  redo: () => {
    const { future, components, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      components: next,
      history: [...history, JSON.parse(JSON.stringify(components))],
      future: future.slice(1),
      previousComponents: [...components], // For second file's undo
    });
  },

  // Simple undo from second file (kept for compatibility)
  undoChanges: () =>
    set((state) => ({
      components: state.previousComponents.length > 0 ? state.previousComponents : state.components,
      previousComponents: [],
    })),

  deleteAllComponents: () => {
    get().addToHistory();
    set((state) => ({
      components: [],
      selectedComponentId: null,
      previousComponents: [...state.components], // For second file's undo
    }));
  },
}));