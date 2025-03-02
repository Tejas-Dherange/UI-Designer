"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Save } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { useToast } from "@/hooks/use-toast"
import { ChromePicker } from "react-color"
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini AI

interface Component {
  id: string
  type: string
  content: string
}

interface UIDesignerProps {
  projectId: string
  initialContent?: { components: Component[] }
}

export function UIDesigner({ projectId, initialContent }: UIDesignerProps) {
  const [components, setComponents] = useState<Component[]>(initialContent?.components || [])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [cssProperties, setCssProperties] = useState<{
    color: string
    fontSize: string
    backgroundColor: string
    padding: string
    margin: string
    borderRadius: string
  }>({
    color: '#000000', // Default text color
    fontSize: '16px', // Default font size
    backgroundColor: '#ffffff', // Default background color
    padding: '10px', // Default padding
    margin: '10px', // Default margin
    borderRadius: '5px', // Default border radius
  })

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI("AIzaSyBeo0xkvjSvd2ptZ48cRsMxn-MbPPYdoEk"); // Replace with your actual API key

  // Available components for dragging
  const componentTypes = [
    { id: "heading", type: "heading", content: "Heading" },
    { id: "paragraph", type: "paragraph", content: "Paragraph text" },
    { id: "button", type: "button", content: "Button" },
    { id: "input", type: "input", content: "Input field" },
  ]

  // Handle drag end
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === "components" && result.destination.droppableId === "canvas") {
      const component = componentTypes.find((c) => c.id === result.draggableId)
      if (component) {
        const newComponent = {
          id: `${component.id}-${Date.now()}`,
          type: component.type,
          content: component.content,
        }
        setComponents([...components, newComponent])
      }
    } else if (result.source.droppableId === "canvas" && result.destination.droppableId === "canvas") {
      const items = Array.from(components)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setComponents(items)
    }
  }

  // Save project
  const saveProject = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { components } }),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Changes saved",
        description: "Your project has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    }
    setLoading(false)
  }

const getAISuggestions = async () => {
  setLoading(true);
  try {
    const prompt = `I have a UI with these components: ${components.map((c) => c.type).join(", ")}. 
                   Suggest improvements for better user experience in one sentence.`;

    // Call the Gemini API directly
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer AIzaSyBeo0xkvjSvd2ptZ48cRsMxn-MbPPYdoEk`, // Replace with your actual API key
      },
      body: JSON.stringify({
        prompt: prompt,
        max_output_tokens: 50, // Adjust as needed
        temperature: 0.7, // Adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI suggestions");
    }

    const data = await response.json();
    const suggestion = data?.candidates[0]?.text || "No suggestions available.";

    toast({
      title: "AI Suggestion",
      description: suggestion,
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to get AI suggestions.",
    });
  }
  setLoading(false);
};

  // Update component content
  const updateComponent = (id: string, content: string) => {
    setComponents(components.map((component) => (component.id === id ? { ...component, content } : component)))
  }

  // Render component
  const renderComponent = (component: Component) => {
    return (
      <div
        style={{
          color: cssProperties.color,
          fontSize: cssProperties.fontSize,
          backgroundColor: cssProperties.backgroundColor,
          padding: cssProperties.padding,
          margin: cssProperties.margin,
          borderRadius: cssProperties.borderRadius,
        }}
        onClick={() => {
          setSelectedComponent(component);
          setCssProperties({ 
            color: cssProperties.color, 
            fontSize: cssProperties.fontSize,
            backgroundColor: cssProperties.backgroundColor,
            padding: cssProperties.padding,
            margin: cssProperties.margin,
            borderRadius: cssProperties.borderRadius,
          }); // Set current styles
        }}
      >
        {component.type === "heading" && <h1>{component.content}</h1>}
        {component.type === "paragraph" && <p>{component.content}</p>}
        {component.type === "button" && <button>{component.content}</button>}
        {component.type === "input" && <input placeholder={component.content} />}
      </div>
    )
  }

  // Handle color change from the color picker
  const handleColorChange = (color: any) => {
    setCssProperties({ ...cssProperties, color: color.hex });
  };

  // Handle background color change
  const handleBackgroundColorChange = (color: any) => {
    setCssProperties({ ...cssProperties, backgroundColor: color.hex });
  };

  // Generate component code for copying
  const generateComponentCode = () => {
    return components.map(component => {
      return `
        <${component.type} 
          style="color: ${cssProperties.color}; 
                 background-color: ${cssProperties.backgroundColor}; 
                 font-size: ${cssProperties.fontSize}; 
                 padding: ${cssProperties.padding}; 
                 margin: ${cssProperties.margin}; 
                 border-radius: ${cssProperties.borderRadius};">
          ${component.content}
        </${component.type}>
      `;
    }).join("\n");
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">UI Designer</h1>
          <div className="flex gap-2">
            <Button onClick={getAISuggestions} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestions
            </Button>
            <Button onClick={saveProject} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {/* Component Library */}
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="components" isDropDisabled={true}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {componentTypes.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-2 mb-2 border rounded cursor-grab hover:bg-accent"
                            >
                              {component.type}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="canvas">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[500px] p-4 border-2 border-dashed rounded-lg"
                    >
                      {components.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Drag components here
                        </div>
                      ) : (
                        components.map((component, index) => (
                          <Draggable key={component.id} draggableId={component.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 mb-4 border rounded-lg hover:border-primary"
                              >
                                {renderComponent(component)}
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        </DragDropContext>
      </div>

      {/* Right Side Properties Panel */}
      <div className="w-1/4 p-4 border-l">
        <h2 className="text-xl font-bold">Edit Properties</h2>
        {selectedComponent ? (
          <div>
            <label className="block mb-2">
              Text Color:
              <ChromePicker color={cssProperties.color} onChange={handleColorChange} />
            </label>
            <label className="block mb-2">
              Background Color:
              <ChromePicker color={cssProperties.backgroundColor} onChange={handleBackgroundColorChange} />
            </label>
            <label className="block mb-2">
              Font Size:
              <Input
                type="text"
                value={cssProperties.fontSize}
                onChange={(e) => setCssProperties({ ...cssProperties, fontSize: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              Padding:
              <Input
                type="text"
                value={cssProperties.padding}
                onChange={(e) => setCssProperties({ ...cssProperties, padding: e.target.value })}
                placeholder="e.g., 10px"
              />
            </label>
            <label className="block mb-2">
              Margin:
              <Input
                type="text"
                value={cssProperties.margin}
                onChange={(e) => setCssProperties({ ...cssProperties, margin: e.target.value })}
                placeholder="e.g., 10px"
              />
            </label>
            <label className="block mb-2">
              Border Radius:
              <Input
                type="text"
                value={cssProperties.borderRadius}
                onChange={(e) => setCssProperties({ ...cssProperties, borderRadius: e.target.value })}
                placeholder="e.g., 5px"
              />
            </label>
            <Button onClick={() => navigator.clipboard.writeText(generateComponentCode())}>
              Copy Component Code
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a component to edit its properties.</p>
        )}
      </div>
    </div>
  )
}

export default UIDesigner