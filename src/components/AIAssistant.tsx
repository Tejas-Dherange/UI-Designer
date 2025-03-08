import React, { useState } from 'react';
import { useComponentStore } from '../store/componentStore';
import { Wand2, RefreshCw, XCircle, Undo2, Check, Plus } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const AIAssistant: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedComponent, setGeneratedComponent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { components, setComponents, selectComponent } = useComponentStore();
  const [prevComponents, setPrevComponents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate'>('analyze');
  const [componentName, setComponentName] = useState('');

  // Improved JSON extraction function with better error handling
  const extractValidJSON = (text: string) => {
    try {
      // First attempt: Try to parse the entire text as JSON
      return JSON.parse(text);
    } catch (err) {
      // Second attempt: Try to extract JSON using regex
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}|\[\s*\{[\s\S]*\}\s*\]/);
        if (!jsonMatch) return null;
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        // Third attempt: Try finding code blocks with JSON
        try {
          const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (codeBlockMatch && codeBlockMatch[1]) {
            return JSON.parse(codeBlockMatch[1]);
          }
        } catch (err) {
          console.error('All JSON parsing attempts failed:', err);
        }
        return null;
      }
    }
  };

  // ✅ Analyze Canvas Function
  const handleAnalyzeCanvas = async () => {
    if (!components.length) {
      setError('No components in the canvas to analyze.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedText('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const componentDetails = components
        .map((comp) => `Component: ${comp.type}, Properties: ${JSON.stringify(comp.props)}`)
        .join("\n");

        const fullPrompt = `
        You are an AI assistant specializing in UI/UX design. Your task is to improve the design, color scheme, and layout of the given UI components while ensuring proper alignment within the canvas.
        
        ### Instructions:
        1️⃣ **Improve Color Scheme:** Enhance colors based on UI best practices, ensuring good contrast and readability.  
        2️⃣ **Refine Layout:** Adjust positioning (\\\`left\\\`, \\\`top\\\`), width, height, and alignment for better spacing.  
        3️⃣ **Enhance Design:** Apply subtle shadows, rounded corners, and spacing to make the components visually appealing.  
        4️⃣ **Maintain Structure:** Preserve the hierarchy of components without removing any necessary attributes.  
        5️⃣ **Ensure Readability:** Choose font sizes, text colors, and padding that enhance clarity.  
        
        ### Canvas Components:
        \`\`\`
        ${componentDetails}
        \`\`\`
        
        ### Response Format:
        - **Return ONLY a valid JSON array** of updated components.
        - **DO NOT include explanations, comments, or additional text.**
        - **Ensure that every component has a valid "id", "type", and "props" with a "style" object.**
        
        ### Example JSON Output:
        \`\`\`json
        [
          { 
            "id": "1", 
            "type": "button", 
            "props": { 
              "style": { 
                "left": "20px", 
                "top": "50px", 
                "backgroundColor": "#007bff", 
                "color": "#ffffff", 
                "borderRadius": "6px", 
                "padding": "10px 16px", 
                "boxShadow": "0px 4px 6px rgba(0, 0, 0, 0.1)"
              }, 
              "children": "Click Me" 
            }
          },
          { 
            "id": "2", 
            "type": "text", 
            "props": { 
              "style": { 
                "left": "30px", 
                "top": "100px", 
                "fontSize": "18px", 
                "color": "#333333", 
                "padding": "4px"
              }, 
              "children": "Welcome to the Canvas!"
            }
          }
        ]
        \`\`\`
        
        🔹 **Your task:** Apply these improvements and return a fully optimized JSON array.  
        🔹 **DO NOT include any explanation, just output JSON.**  
        
        **Begin now.**
        `;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      setGeneratedText(response.text());
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Failed to analyze canvas. Please try again.');
    }

    setIsGenerating(false);
  };

  // ✅ Apply AI Optimized Components to Canvas
  const handleApplyAnalyzedChanges = () => {
    if (!generatedText.trim()) return;

    try {
      const extractedJSON = extractValidJSON(generatedText);
      if (!extractedJSON || !Array.isArray(extractedJSON)) throw new Error("Invalid AI response format.");

      // Make sure all components have a valid structure with string children
      const validComponents = extractedJSON.map(comp => ({
        ...comp,
        id: comp.id || uuidv4(),
        type: comp.type || 'div',
        props: {
          ...comp.props,
          style: {
            ...(comp.props?.style || {}),
            left: comp.props?.style?.left || '0px',
            top: comp.props?.style?.top || '0px'
          },
          // Ensure children is a string or valid JSX element
          children: typeof comp.props?.children === 'string' ? comp.props.children : 'Component'
        }
      }));

      setPrevComponents([...components]);
      setComponents(validComponents);
      if (validComponents.length > 0) {
        selectComponent(validComponents[0].id);
      }
    } catch (err) {
      setError("AI response is not in valid JSON format.");
      console.error("❌ Error applying analyzed changes:", err);
    }
  };

  // ✅ Generate New Component from AI - FIXED
  const handleGenerateComponent = async () => {
    if (!componentName.trim()) {
      setError("Please enter a component name.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedComponent(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const componentId = uuidv4();

      const generatePrompt = `
  You are an AI specializing in **UI/UX design**.  
  Your task is to generate a **high-quality, well-structured, and visually appealing** generic UI component named **"${componentName}"**.

  ### **Design Rules for a Perfect UI Component:**
  ✅ **Best Color Combinations:** Use modern, accessible, and well-contrasted colors (e.g., blue, gray, neutral tones).  
  ✅ **Proper Spacing & Alignment:** Apply appropriate **padding, margins, and border-radius** for a polished look.  
  ✅ **Consistency & Readability:** Font sizes and typography should be **clear, professional, and balanced**.  
  ✅ **Responsive Design:** Ensure the component **adapts seamlessly** across desktop, tablet, and mobile.  
  ✅ **Elegant Shadows & Borders:** Apply **subtle box-shadow** and **border-radius** to enhance visual depth.  
  ✅ **Interactive States (if applicable):** Provide **hover, focus, and active states** for better user experience.  
  ✅ **Maintain Simplicity & Usability:** Keep the UI intuitive, avoiding unnecessary complexity.  

  ### **Component Details:**
  Generate a JSON object with the following structure:  
  \`\`\`json
  {
    "id": "${componentId}",
    "type": "div",
    "props": { 
      "style": {
        "width": "clamp(200px, 100%, 400px)",  
        "height": "auto",
        "padding": "16px",
        "borderRadius": "8px",
        "boxShadow": "0px 4px 8px rgba(0, 0, 0, 0.1)",
        "backgroundColor": "#ffffff",
        "color": "#222222",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "textAlign": "center",
        "fontSize": "16px",
        "fontWeight": "500",
        "border": "1px solid rgba(0, 0, 0, 0.1)"
      },
      "hover": {
        "backgroundColor": "#f5f5f5",
        "boxShadow": "0px 6px 12px rgba(0, 0, 0, 0.15)"
      },
      "children": "${componentName}"
    }
  }
  \`\`\`

  🎨 **Your Task:** Generate a **clean, visually appealing, and fully responsive "${componentName}"** with best practices in design and usability.  
  ⚠️ **DO NOT include explanations—ONLY return valid JSON.**  

  🔹 **Begin now.**
`;


      const result = await model.generateContent(generatePrompt);
      const response = await result.response;
      const responseText = response.text();
      
      console.log("AI Response:", responseText);
      
      // Try to extract valid JSON from the response
      const extractedJSON = extractValidJSON(responseText);
      
      // If extraction fails, create a default component
      if (!extractedJSON) {
        const defaultComponent = {
          id: componentId,
          type: "div",
          props: {
            style: {
              width: "200px",
              height: "auto",
              left: "100px",
              top: "100px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            },
            children: componentName
          }
        };
        
        setGeneratedComponent(defaultComponent);
        console.log("Using default component:", defaultComponent);
      } else {
        // Make sure extracted JSON has the correct structure
        const safeComponent = {
          ...extractedJSON,
          id: extractedJSON.id || componentId,
          type: extractedJSON.type || "div",
          props: {
            ...(extractedJSON.props || {}),
            style: {
              ...(extractedJSON.props?.style || {}),
              left: extractedJSON.props?.style?.left || "100px",
              top: extractedJSON.props?.style?.top || "100px",
              width: extractedJSON.props?.style?.width || "200px"
            },
            // Ensure children is a string, not an object
            children: typeof extractedJSON.props?.children === 'string' 
              ? extractedJSON.props.children 
              : componentName
          }
        };
        
        setGeneratedComponent(safeComponent);
        console.log("Successfully extracted component:", safeComponent);
      }
    } catch (err) {
      console.error('Error generating component:', err);
      setError('Failed to generate component. Please try again.');
      
      // Create fallback component when error occurs
      const fallbackComponent = {
        id: uuidv4(),
        type: "div",
        props: {
          style: {
            width: "200px",
            height: "auto",
            left: "100px",
            top: "100px",
            backgroundColor: "#f8f9fa",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          },
          children: componentName || "New Component"
        }
      };
      
      setGeneratedComponent(fallbackComponent);
    }

    setIsGenerating(false);
  };

  // ✅ Apply Generated Component to Canvas
  const handleApplyGeneratedChanges = () => {
    if (!generatedComponent) return;

    try {
      // Add safeguards to ensure the component has the correct structure
      const safeComponent = {
        ...generatedComponent,
        id: generatedComponent.id || uuidv4(),
        type: generatedComponent.type || "div",
        props: {
          ...(generatedComponent.props || {}),
          style: {
            ...(generatedComponent.props?.style || {}),
            // Ensure required style properties exist
            left: generatedComponent.props?.style?.left || "100px",
            top: generatedComponent.props?.style?.top || "100px",
            width: generatedComponent.props?.style?.width || "200px"
          },
          // Ensure children is a string, not an object
          children: typeof generatedComponent.props?.children === 'string' 
            ? generatedComponent.props.children 
            : (componentName || "New Component")
        }
      };
      
      setComponents([...components, safeComponent]);
      selectComponent(safeComponent.id);
    } catch (err) {
      console.error("Error applying generated component:", err);
      setError("Could not apply the generated component.");
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Tab Navigation */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'analyze' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('analyze')}
        >
          Analyze Canvas
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Component
        </button>
      </div>

      {activeTab === 'analyze' && (
        <>
          <button 
            className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center" 
            onClick={handleAnalyzeCanvas} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><RefreshCw size={14} className="animate-spin mr-2" /> Analyzing...</>
            ) : (
              'Analyze Canvas'
            )}
          </button>
          {generatedText && (
            <button className="w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center" onClick={handleApplyAnalyzedChanges}>
              <Check size={14} className="mr-2" /> Apply Analyzed Changes
            </button>
          )}
        </>
      )}

      {activeTab === 'generate' && (
        <>
          <div className="space-y-2">
            <input 
              type="text" 
              value={componentName} 
              onChange={(e) => setComponentName(e.target.value)} 
              placeholder="Enter component name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            
            <button 
              className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center" 
              onClick={handleGenerateComponent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><RefreshCw size={14} className="animate-spin mr-2" /> Generating...</>
              ) : (
                <>
                  <Plus size={14} className="mr-2" /> Generate Component
                </>
              )}
            </button>
            
            {generatedComponent && (
              <button 
                className="w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center" 
                onClick={handleApplyGeneratedChanges}
              >
                <Check size={14} className="mr-2" /> Add to Canvas
              </button>
            )}
          </div>
        </>
      )}
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-2 py-1"
            onClick={() => setError(null)}
          >
            <XCircle size={16} />
          </button>
        </div>
      )}
    </div>
  );
};