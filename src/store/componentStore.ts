import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Component } from "../types/component";

interface ComponentStore {
  components: Component[];
  selectedComponentId: string | null;
  addComponent: (component: Omit<Component, "id">) => void;
  updateComponent: (id: string, updatedProps: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string) => void;
  setComponents: (newComponents: Component[]) => void;
  undoChanges: () => void;
  deleteAllComponents: () => void; // ✅ Now correctly added
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  components: [],
  selectedComponentId: null,
  previousComponents: [], // ✅ Store previous state for undo

  addComponent: (component) =>
    set((state) => {
      const newComponent = { ...component, id: uuidv4() };
      return {
        previousComponents: [...state.components], // ✅ Store before updating
        components: [...state.components, newComponent],
        selectedComponentId: newComponent.id,
      };
    }),

  updateComponent: (id, updatedProps) =>
    set((state) => ({
      previousComponents: [...state.components], // ✅ Store before updating
      components: state.components.map((comp) => (comp.id === id ? { ...comp, ...updatedProps } : comp)),
    })),

  deleteComponent: (id) =>
    set((state) => ({
      previousComponents: [...state.components], // ✅ Store before deleting
      components: state.components.filter((comp) => comp.id !== id),
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
    })),

  selectComponent: (id) => set({ selectedComponentId: id }),

  setComponents: (newComponents) =>
    set((state) => ({
      previousComponents: [...state.components], // ✅ Store before replacing
      components: newComponents,
    })),

  undoChanges: () =>
    set((state) => ({
      components: state.previousComponents.length > 0 ? state.previousComponents : state.components, // ✅ Restore last state
      previousComponents: [], // ✅ Clear previous state after undo
    })),

  deleteAllComponents: () =>
    set((state) => ({
      previousComponents: [...state.components], // ✅ Store before deleting all
      components: [],
      selectedComponentId: null,
    })),
}));
