"use client";
import { useEffect, useState } from "react";
import { Component } from "@/types/component"; // Import your component type
import { ComponentRenderer } from "@/components/ComponentRenderer"; // Import your renderer

export default function PreviewPage() {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    // ✅ Load the stored components
    const savedComponents = localStorage.getItem("canvasComponents");
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center ">
      <div className="w-full  bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Canvas Preview</h1>

        {/* Render Components as they were arranged */}
        <div className="relative border border-gray-300 bg-gray-50 h-full ">
          {components.length > 0 ? (
            components.map((component) => (
              <div
                key={component.id}
                className="absolute"
                style={{
                  left: component.props.style?.left || "0%",
                  top: component.props.style?.top || "0%",
                  width: component.props.style?.width || "auto",
                  height: component.props.style?.height || "auto",
                }}
              >
                <ComponentRenderer component={component} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No components to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}
