import React from "react";
import { Component } from "../types/component";

interface ComponentRendererProps {
  component: Component;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  const { type, props } = component;

  // Ensure props and styles are always defined
  const componentStyle = props?.style || {};
  const componentClass = props?.className || "";
  const componentChildren = props?.children || null;

  switch (type) {
    case "button":
      return (
        <button
          style={componentStyle}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${componentClass}`}
        >
          {componentChildren || "Button"}
        </button>
      );

    case "text":
      return (
        <p style={componentStyle} className={`text-base ${componentClass}`}>
          {componentChildren || "Text Component"}
        </p>
      );

    case "input":
      return (
        <input
          type="text"
          placeholder={props?.placeholder || "Enter text..."}
          style={componentStyle}
          className={`border border-gray-300 rounded px-3 py-2 w-full ${componentClass}`}
        />
      );

    case "div":
      return (
        <div
          style={componentStyle}
          className={`p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100 ${componentClass}`}
        >
          {componentChildren}
        </div>
      );

    case "card":
      return (
        <div
          style={componentStyle}
          className={`bg-white border border-gray-200 rounded-lg shadow p-4 ${componentClass}`}
        >
          {componentChildren || (
            <>
              <h3 className="text-lg font-medium mb-2">Card Title</h3>
              <p className="text-gray-600">Card content goes here.</p>
            </>
          )}
        </div>
      );

    case "image":
      return (
        <img
          src={props?.src || "https://via.placeholder.com/150"}
          alt={props?.alt || "Image"}
          style={{ maxWidth: "100%", height: "auto", ...componentStyle }}
          className={`object-cover ${componentClass}`}
        />
      );

    case "navbar":
      return (
        <nav
          style={componentStyle}
          className={`bg-white shadow px-4 py-3 flex items-center justify-between ${componentClass}`}
        >
          <div className="font-bold text-xl">Logo</div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
          </div>
        </nav>
      );

    case "form":
      return (
        <form style={componentStyle} className={`space-y-4 ${componentClass}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="border border-gray-300 rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="border border-gray-300 rounded px-3 py-2 w-full" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      );

    default:
      return <div>Unknown component type: {type}</div>;
  }
};
