import React from "react";
import { useComponentStore } from "../store/componentStore";
import { Trash2, Eye, EyeOff, Copy, ArrowUp, ArrowDown } from "lucide-react";

export const Sidebar: React.FC = () => {
  const {
    components,
    selectComponent,
    selectedComponentId,
    deleteComponent,
    deleteTemplate,
    deleteAllComponents,
    toggleVisibility,
    undo,
    redo,
    duplicateComponent,
  } = useComponentStore();

  // Group components by template
  const groupedComponents = components.reduce((acc, component) => {
    const templateId = component.templateId || "Ungrouped"; // Default group if no template
    if (!acc[templateId]) acc[templateId] = [];
    acc[templateId].push(component);
    return acc;
  }, {} as Record<string, typeof components>);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Layers
      </h3>

      {Object.keys(groupedComponents).length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No components added yet</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedComponents).map(([templateId, templateComponents]) => (
            <div key={templateId}>
              {/* 🏷️ Template Name with Delete Button */}
              <div className="flex justify-between items-center bg-gray-200 p-2 rounded-md">
                <span className="font-semibold text-sm">{templateId}</span>
                <button
                  className="p-1 text-gray-600 hover:text-red-600"
                  title={templateId === "Ungrouped" ? "Delete All Components" : "Delete Template"}
                  onClick={() => (templateId === "Ungrouped" ? deleteAllComponents() : deleteTemplate(templateId))}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* 🏗️ Components List */}
              <div className="space-y-1 mt-2">
                {templateComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      selectedComponentId === component.id
                        ? "bg-blue-50 border-l-2 border-blue-500"
                        : "hover:bg-gray-100"
                    } ${component.isVisible === false ? 'opacity-50' : ''}`}
                    onClick={() => selectComponent(component.id)}
                  >
                    <div className="flex items-center">
                      <span className="capitalize">{component.type}</span>
                      {component.props.children &&
                        typeof component.props.children === "string" && (
                          <span className="text-gray-500 text-xs ml-2 truncate max-w-[100px]">
                            {component.props.children}
                          </span>
                        )}
                    </div>

                    {/* 🛠️ Action Buttons */}
                    <div className="flex space-x-1">
                      <button 
                        className="p-1 rounded text-gray-400 hover:text-gray-700"
                        title="Toggle visibility"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(component.id);
                        }}
                      >
                        {component.isVisible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-gray-700 rounded" 
                        title="Duplicate"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateComponent(component.id);
                        }}
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-gray-700 rounded" 
                        title="Move up"
                        onClick={(e) => {
                          e.stopPropagation();
                          undo();
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-gray-700 rounded" 
                        title="Move down"
                        onClick={(e) => {
                          e.stopPropagation();
                          redo();
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(component.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};