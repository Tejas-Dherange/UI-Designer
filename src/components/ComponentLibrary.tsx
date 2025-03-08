import React, { useState, useEffect } from "react";
import {
  Donut as Button,
  Type,
  FormInput,
  Image,
  Layout,
  Square,
  Navigation,
  Upload,
  File,
} from "lucide-react";
import { templates } from "../data/template";
import { useComponentStore } from "../store/componentStore";

export const ComponentLibrary: React.FC = () => {
  const { addComponent } = useComponentStore();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  /** Load uploaded images from localStorage on mount */
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("uploadedImages") || "[]");
    setUploadedImages(storedImages);
  }, []);

  /** Save uploaded images to localStorage whenever updated */
  useEffect(() => {
    localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  /** Handles uploading images from the user's system */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result.toString()]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  /** Handles dragging components */
  const handleDragStart = (e: React.DragEvent, componentType: string, imageUrl?: string) => {
    e.dataTransfer.setData("componentType", componentType);
    if (imageUrl) {
      e.dataTransfer.setData("imageUrl", imageUrl);
    }
  };

  /** Handles template selection */
  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find((t) => t.id === templateId);
    if (selectedTemplate) {
      setSelectedTemplateId(templateId);
      selectedTemplate.components.forEach((component) => {
        addComponent({
          type: component.type,
          props: component.props,
        });
      });
    }
  };

  /** Handles deleting a template */
  const deleteTemplate = (templateId: string) => {
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    }
  };

  /** List of component categories */
  const componentCategories = [
    {
      name: "Basic",
      components: [
        { type: "button", icon: <Button size={ 16}/>, label: "Button" },
        { type: "text", icon: <Type size={16} />, label: "Text" },
        { type: "input", icon: <FormInput size={16} />, label: "Input" },
        { type: "div", icon: <Layout size={16} />, label: "Container" },
      ],
    },
    {
      name: "Layout",
      components: [
        { type: "card", icon: <Square size={16} />, label: "Card" },
        { type: "navbar", icon: <Navigation size={16} />, label: "Navbar" },
      ],
    },
    {
      name: "Media",
      components: [{ type: "image", icon: <Image size={16} />, label: "Image" }],
    },
    {
      name: "Forms",
      components: [{ type: "form", icon: <Layout size={16} />, label: "Form" }],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Component Categories */}
      {componentCategories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {category.name}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {category.components.map((component) => (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component.type)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-move transition-colors duration-150"
              >
                <div className="text-gray-700 mb-1">{component.icon}</div>
                <span className="text-xs text-gray-600">{component.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Media Upload Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Media
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Default Image Option */}
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, "image")}
            className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-move transition-colors duration-150"
          >
            <Image size={16} className="text-gray-700 mb-1" />
            <span className="text-xs text-gray-600">Default Image</span>
          </div>

          {/* Upload Image Option */}
          <label className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150">
            <Upload size={16} className="text-gray-700 mb-1" />
            <span className="text-xs text-gray-600">Choose from System</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Display Uploaded Images */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, "image", image)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-move transition-colors duration-150"
            >
              <img src={image} alt={`Uploaded ${index}`} className="w-16 h-16 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Templates Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Templates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <div key={template.id} className="relative">
              <button
                onClick={() => handleTemplateSelect(template.id)}
                className={`flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-150 ${
                  selectedTemplateId === template.id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <File size={16} className="text-gray-700 mb-1" />
                <span className="text-xs text-gray-600">{template.name}</span>
              </button>

              {/* Delete Template Button */}
              {selectedTemplateId === template.id && (
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition duration-150"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};