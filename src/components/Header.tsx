import { useState, useEffect } from "react";
import { Save, Play, Share2, Copy, Link, Code } from "lucide-react";
import { useComponentStore } from "../store/componentStore";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { components } = useComponentStore();
  const router = useRouter();
  
  // State management
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isCodePopupOpen, setIsCodePopupOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState("jsx");
  const [shareableLink, setShareableLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("Click 'Generate' to create code");
  
  // Generate code with AI - Fixed canvas finding issues
  const generateCodeWithAI = async () => {
    // Open the popup first
    setIsCodePopupOpen(true);
    setIsGenerating(true);
    setGeneratedCode("Generating...");
    
    // Use a more reliable way to find the canvas
    // Try multiple potential canvas selectors
    const canvas = 
      document.getElementById("canvas-container") || 
      document.querySelector("[data-canvas]") ||
      document.querySelector(".canvas-area") ||
      document.querySelector(".design-canvas");
    
    if (!canvas) {
      setGeneratedCode("⚠️ Canvas not found! Make sure the canvas has id='canvas-container'");
      setIsGenerating(false);
      return;
    }

    // Extract Canvas HTML & Styles
    const canvasHTML = canvas.innerHTML;
    
    // Get only the relevant stylesheets to reduce payload
    const styles = Array.from(document.styleSheets)
      .filter(sheet => {
        try {
          // Filter out extension stylesheets or cross-origin sheets
          return sheet.href === null || sheet.href.startsWith(window.location.origin);
        } catch (err) {
          return false; // Skip problematic stylesheets
        }
      })
      .flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules || []);
        } catch (err) {
          return []; // Skip inaccessible stylesheets
        }
      })
      .map(rule => rule.cssText)
      .join("\n");

    try {
      // Call API route
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          html: canvasHTML, 
          css: styles,
          components: components // Also send component data for better code generation
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedCode(data.code);
      } else {
        setGeneratedCode(`⚠️ Error: ${data.message || "Unknown error generating code"}`);
      }
    } catch (error) {
      console.error("⚠️ Error:", error);
      setGeneratedCode("⚠️ Failed to generate code. Check console for details.");
    }

    setIsGenerating(false);
  };

  // Copy Code to Clipboard with feedback
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content || getActiveCode());
    
    // Visual feedback without using alert
    const button = document.activeElement;
    if (button) {
      const originalText = button.innerText;
      button.innerText = "✅ Copied!";
      setTimeout(() => {
        button.innerText = originalText;
      }, 2000);
    }
  };

  // Download Code as File
  const downloadCode = () => {
    const codeToDownload = isCodePopupOpen ? generatedCode : getActiveCode();
    const extension = activeFormat === "json" ? "json" : "html";
    
    const blob = new Blob([codeToDownload], { type: `text/${extension}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai_generated_ui.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Code generation functions
  const getJSXCode = () => {
    if (components.length === 0) return "// No components to display";

    return components
      .map((c) => {
        let propsString = Object.entries(c.props || {})
          .filter(([key]) => key !== "children") // Handle children separately
          .map(([key, value]) => {
            if (typeof value === "string") return `${key}="${value}"`;
            if (typeof value === "boolean" && value) return key;
            return `${key}={${JSON.stringify(value)}}`;
          })
          .join(" ");

        // Handle nested children correctly
        const childContent = c.props.children || "";
        
        return `<${c.type} ${propsString}>${childContent}</${c.type}>`;
      })
      .join("\n");
  };

  const getHTMLCode = () => {
    if (components.length === 0) return "<!-- No components to display -->";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Design</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 800px; margin: auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .container { padding: 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${components
      .map(
        (c) => `
    <div class="${c.type.toLowerCase()}" style="${Object.entries(c.props.style || {})
          .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value};`)
          .join(" ")}">
      ${c.props.children || ""}
    </div>`
      )
      .join("\n")}
  </div>
</body>
</html>`;
  };

  const getJSONCode = () => JSON.stringify(components, null, 2);

  // Get active format code
  const getActiveCode = () => {
    switch (activeFormat) {
      case "jsx":
        return getJSXCode();
      case "html":
        return getHTMLCode();
      case "json":
        return getJSONCode();
      default:
        return "";
    }
  };

  // Preview functionality
  const handlePreview = () => {
    // Save the component tree in localStorage
    localStorage.setItem("canvasComponents", JSON.stringify(components));
  
    // Navigate to the preview page
    router.push("/dashboard/preview");
  };
  
  // Save project
  const saveProject = async () => {
    try {
      const name = prompt("Enter project name:");
      if (!name?.trim()) {
        alert("❌ Project name is required!");
        return;
      }
  
      const type = prompt("Enter project type (e.g., Web, Mobile, UI Design, etc.):");
      if (!type?.trim()) {
        alert("❌ Project type is required!");
        return;
      }
  
      // Loading indicator
      const saveBtn = document.querySelector("[data-save-btn]");
      if (saveBtn) {
        const originalText = saveBtn.innerText;
        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;
        
        setTimeout(() => {
          saveBtn.innerText = originalText;
          saveBtn.disabled = false;
        }, 5000); // Reset after 5 seconds (failsafe)
      }
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          userId: "12345", // Consider using a dynamic userId from auth system
          components,
          createdAt: new Date().toISOString(),
        }),
      });
  
      const data = await response.json();
      
      // Reset button state
      if (saveBtn) {
        saveBtn.innerText = "Save";
        saveBtn.disabled = false;
      }
      
      if (response.ok) {
        alert(`✅ Project "${name}" saved successfully!`);
      } else {
        console.error("❌ Error Response:", data);
        alert(`Failed to save project: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Error saving project:", error);
      alert("An error occurred while saving the project.");
    }
  };
  
  // Generate Shareable Link
  const generateShareableLink = () => {
    const componentsData = getJSONCode();
    
    // Store in localStorage
    localStorage.setItem("sharedComponents", componentsData);
    
    // Generate URL with timestamp to prevent caching issues
    const url = `${window.location.origin}/shared?data=local&t=${Date.now()}`;
    setShareableLink(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="text-blue-600 font-bold text-xl">UI Designer</div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePreview} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
            <Play size={16} className="mr-1" />
            Preview
          </button>
          <button 
            data-save-btn
            onClick={saveProject} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <Save size={16} className="mr-1" />
            Save
          </button>
          <button 
            onClick={generateCodeWithAI} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <Code size={16} className="mr-1" />
            Generate Code
          </button>
          <button 
            onClick={() => setIsSharePopupOpen(true)} 
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <Share2 size={16} className="mr-1" />
            Share
          </button>
        </div>
      </header>

      {/* Share/Export Popup */}
      {isSharePopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Export Code</h2>

            {/* Tab Buttons */}
            <div className="flex border-b mb-2">
              {["jsx", "html", "json"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFormat(tab)}
                  className={`px-4 py-2 text-sm ${
                    activeFormat === tab ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="relative bg-gray-100 p-4 rounded text-sm border max-h-60 overflow-auto font-mono">
              <pre className="whitespace-pre-wrap break-words">
                <code>{getActiveCode()}</code>
              </pre>
              <button 
                onClick={() => copyToClipboard(getActiveCode())} 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white bg-opacity-70 rounded">
                <Copy size={16} />
              </button>
            </div>

            {/* Download current format */}
            <button 
              onClick={downloadCode} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
              <Link size={16} className="mr-1" />
              Download {activeFormat.toUpperCase()}
            </button>

            {/* Shareable Link */}
            <button 
              onClick={generateShareableLink} 
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center mt-4">
              <Link size={16} className="mr-2" />
              Generate Shareable Link
            </button>

            {/* Copy Shareable Link */}
            {shareableLink && (
              <div className="mt-3 bg-gray-100 p-2 rounded text-sm flex items-center justify-between">
                <input 
                  type="text" 
                  value={shareableLink} 
                  readOnly 
                  className="w-full bg-white p-1 border rounded text-gray-700" 
                />
                <button 
                  onClick={() => copyToClipboard(shareableLink)} 
                  className="ml-2 text-blue-600 hover:underline flex items-center">
                  <Copy size={14} className="mr-1" />
                  Copy
                </button>
              </div>
            )}

            <button 
              onClick={() => setIsSharePopupOpen(false)} 
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-4 w-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI Code Generation Popup */}
      {isCodePopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">AI-Generated Code</h2>

            {/* Code Preview */}
            <div className="relative bg-gray-100 p-4 rounded text-sm border max-h-60 overflow-auto font-mono">
              <pre className="whitespace-pre-wrap break-words">
                <code>{isGenerating ? "Generating..." : generatedCode}</code>
              </pre>
            </div>

            {/* Buttons: Copy & Download */}
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => copyToClipboard(generatedCode)} 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
                disabled={isGenerating}>
                <Copy size={16} className="mr-1" />
                Copy
              </button>
              <button 
                onClick={downloadCode} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={isGenerating}>
                <Link size={16} className="mr-1" />
                Download
              </button>
              <button 
                onClick={() => setIsCodePopupOpen(false)} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};