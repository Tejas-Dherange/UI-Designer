"use client";
import { useEffect, useState } from "react";
import { Component } from "@/types/component"; 
import { ComponentRenderer } from "@/components/ComponentRenderer"; 
import { Copy, Download, Code, Share, FileCode, Camera } from "lucide-react"; 
import html2canvas from 'html2canvas';

export default function PreviewPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [generatedJSX, setGeneratedJSX] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isFormatting, setIsFormatting] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"html" | "jsx">("html");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);

  useEffect(() => {
    const savedComponents = localStorage.getItem("canvasComponents");
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  // Function to generate exact UI HTML code
  const generateExactUICode = async () => {
    const canvas = document.getElementById("canvas-container");
    if (!canvas) {
      alert("⚠️ Canvas not found! Ensure it has id='canvas-container'");
      return;
    }

    // Get all the Tailwind styles
    const tailwindStyles = document.querySelector('style[data-n-href*="tailwind"]')?.textContent || '';
    
    // Clone the canvas content to avoid modifying the original
    const canvasContent = canvas.innerHTML;
    
    // Create a clean HTML structure that preserves all styling
    const cleanHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Preview</title>
  <style>
    /* Tailwind styles */
    ${tailwindStyles}
    
    /* Additional styles for canvas container */
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    #canvas-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      background-color: #f9fafb;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="canvas-container" class="relative">
    ${canvasContent}
  </div>
</body>
</html>`;

    setIsFormatting(true);
    const formattedHtml = await formatHtmlCode(cleanHtml);
    setGeneratedCode(formattedHtml);
    
    // Generate JSX version at the same time
    generateJSXCode();
    
    setIsFormatting(false);
  };

  // New function to generate JSX code from components
  const generateJSXCode = () => {
    const jsxImports = `import React from 'react';\n\n`;
    
    // Generate JSX component for each component in the array
    const jsxComponents = components.map(component => {
      // Style object from component props
      const styleProps = component.props.style || {};
      const styleObj = Object.entries(styleProps)
        .map(([key, value]) => `  ${key}: "${value}"`)
        .join(',\n');
      
      // Get classes from component props
      const className = component.props.className || '';
      
      // Basic JSX representation of the component
      return `
// Component ID: ${component.id}
const Component${component.id.replace(/-/g, '')} = () => {
  return (
    <div 
      className="${className}"
      style={{
${styleObj}
      }}
    >
      {/* Component content */}
      ${component.type === 'text' 
        ? `<p>${component.props.content || ''}</p>` 
        : `<${component.type} ${Object.entries(component.props)
            .filter(([key]) => !['style', 'className', 'content'].includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')} />`
      }
    </div>
  );
};
`;
    }).join('\n');
    
    // Main component that combines all components
    const mainComponent = `
export default function PreviewLayout() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      ${components.map(comp => `<Component${comp.id.replace(/-/g, '')} />`).join('\n      ')}
    </div>
  );
}
`;
    
    const fullJsx = jsxImports + jsxComponents + mainComponent;
    setGeneratedJSX(fullJsx);
  };

  // Format HTML using AI API
  const formatHtmlCode = async (html: string) => {
    try {
      const response = await fetch("/api/format-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawHtml: html }),
      });

      if (!response.ok) throw new Error("Error formatting code");

      const data = await response.json();
      return data.formattedHtml;
    } catch (error) {
      console.error("Error formatting HTML:", error);
      return html; // Return unformatted code if API fails
    }
  };

  // Copy to clipboard - works for both HTML and JSX
  const copyToClipboard = () => {
    const codeToCopy = activeTab === "html" ? generatedCode : generatedJSX;
    navigator.clipboard.writeText(codeToCopy);
    alert(`✅ ${activeTab.toUpperCase()} code copied to clipboard!`);
  };

  // Download code - works for both HTML and JSX
  const downloadCode = () => {
    const codeToCopy = activeTab === "html" ? generatedCode : generatedJSX;
    const fileType = activeTab === "html" ? "text/html" : "text/jsx";
    const fileName = activeTab === "html" ? "formatted_preview.html" : "preview_component.jsx";
    
    const blob = new Blob([codeToCopy], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate sharable link
  const generateShareableLink = async () => {
    try {
      // Generate HTML code if not already done
      if (!generatedCode) {
        await generateExactUICode();
      }
      
      const response = await fetch("/api/create-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          html: generatedCode,
          components: components
        }),
      });

      if (!response.ok) throw new Error("Error creating shareable link");

      const data = await response.json();
      setShareLink(data.shareUrl);
    } catch (error) {
      console.error("Error creating shareable link:", error);
      alert("⚠️ Failed to create shareable link");
    }
  };

  // Copy share link to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("✅ Share link copied to clipboard!");
  };

  /**
   * IMPROVED CAPTURE FUNCTION: Captures the entire canvas including components beyond the viewport
   */
  const captureCanvasAsImage = async () => {
    setIsCapturing(true);
    setCaptureProgress(10);
    
    try {
      const canvasElement = document.getElementById("canvas-container");
      if (!canvasElement) {
        alert("⚠️ Canvas not found!");
        setIsCapturing(false);
        return;
      }
      
      // Find the maximum boundaries of all components
      let maxBottom = 0;
      let maxRight = 0;
      
      // Calculate the maximum boundaries based on component positions
      components.forEach(component => {
        const style = component.props.style || {};
        const left = parseFloat(String(style.left || "0"));
        const top = parseFloat(String(style.top || "0"));
        const width = parseFloat(String(style.width || "0"));
        const height = parseFloat(String(style.height || "0"));
        
        // Calculate right and bottom edges
        const right = left + width;
        const bottom = top + height;
        
        // Update maximum boundaries
        if (right > maxRight) maxRight = right;
        if (bottom > maxBottom) maxBottom = bottom;
      });
      
      // Convert percentages to pixels if needed
      const containerWidth = canvasElement.offsetWidth;
      const containerHeight = canvasElement.offsetHeight;
      
      // Ensure we have minimum dimensions (viewport size)
      const minWidth = window.innerWidth;
      const minHeight = window.innerHeight;
      
      // Calculate actual dimensions in pixels, accounting for percentage-based positioning
      const actualMaxRight = Math.max(maxRight / 100 * containerWidth, minWidth);
      const actualMaxBottom = Math.max(maxBottom / 100 * containerHeight, minHeight);
      
      // Add some padding to ensure we capture everything
      const captureWidth = Math.ceil(actualMaxRight) + 100;
      const captureHeight = Math.ceil(actualMaxBottom) + 100;
      
      setCaptureProgress(20);
      
      // Save original state of elements
      const originalStyles = {
        html: document.documentElement.style.cssText,
        body: document.body.style.cssText,
        canvas: canvasElement.style.cssText,
        overflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        canvasWidth: canvasElement.style.width,
        canvasHeight: canvasElement.style.height,
        canvasPosition: canvasElement.style.position
      };
      
      // Hide scrollbars and fix layout temporarily
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      
      // Hide the floating buttons temporarily for the screenshot
      const floatingButtons = document.querySelector(".fixed.bottom-5.right-5") as HTMLElement | null;
      const originalButtonsDisplay = floatingButtons ? floatingButtons.style.display : '';
      if (floatingButtons) {
        floatingButtons.style.display = 'none';
      }
      
      // Set canvas size to include all components
      canvasElement.style.width = `${captureWidth}px`;
      canvasElement.style.height = `${captureHeight}px`;
      canvasElement.style.position = 'absolute';
      
      setCaptureProgress(40);
      
      // Allow DOM to update with the new styles
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setCaptureProgress(50);
      
      // Create a canvas with html2canvas that captures the entire element
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: "#f9fafb",
        scale: 2, // Higher resolution
        allowTaint: true,
        useCORS: true,
        width: captureWidth,
        height: captureHeight,
        windowWidth: captureWidth,
        windowHeight: captureHeight,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedCanvas = clonedDoc.getElementById("canvas-container");
          if (clonedCanvas) {
            clonedCanvas.style.width = `${captureWidth}px`;
            clonedCanvas.style.height = `${captureHeight}px`;
            
            // Make sure position is set to ensure correct capturing
            clonedCanvas.style.position = 'absolute';
            clonedCanvas.style.top = '0';
            clonedCanvas.style.left = '0';
            
            // Hide scrollbars in the clone
            clonedCanvas.style.overflow = 'hidden';
          }
        }
      });
      
      setCaptureProgress(80);
      
      // Convert the canvas to a data URL
      const imageUrl = canvas.toDataURL("image/png");
      
      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = "canvas_preview.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setCaptureProgress(100);
      
      // Restore original states
      document.documentElement.style.cssText = originalStyles.html;
      document.body.style.cssText = originalStyles.body;
      canvasElement.style.cssText = originalStyles.canvas;
      document.documentElement.style.overflow = originalStyles.overflow;
      document.body.style.overflow = originalStyles.bodyOverflow;
      
      // Specifically restore these important properties
      canvasElement.style.width = originalStyles.canvasWidth;
      canvasElement.style.height = originalStyles.canvasHeight;
      canvasElement.style.position = originalStyles.canvasPosition;
      
      window.scrollTo(originalStyles.scrollX, originalStyles.scrollY);
      
      if (floatingButtons) {
        floatingButtons.style.display = originalButtonsDisplay;
      }
      
    } catch (error) {
      console.error("Error capturing canvas:", error);
      alert("⚠️ Failed to capture canvas as image. Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setTimeout(() => {
        setIsCapturing(false);
        setCaptureProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full bg-white shadow-lg rounded-lg">
        {/* Canvas container with improved styles for proper content display */}
        <div 
          id="canvas-container" 
          className="relative border border-gray-300 bg-gray-50 overflow-visible" 
          style={{ 
            minHeight: "100vh", 
            height: "auto",
            width: "100%"
          }}
        >
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
            <p className="text-gray-500 text-center py-10">No components to preview.</p>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 flex gap-2 z-40">
        <button 
          onClick={captureCanvasAsImage} 
          className={`bg-purple-600 text-white p-3 rounded-full shadow-md hover:bg-purple-700 ${isCapturing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Download Canvas as Image"
          disabled={isCapturing}
        >
          <Camera size={20} />
        </button>
        <button 
          onClick={generateExactUICode} 
          className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700"
          title="Generate Code"
        >
          <Code size={20} />
        </button>
        <button 
          onClick={generateShareableLink} 
          className="bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
          title="Generate Shareable Link"
        >
          <Share size={20} />
        </button>
      </div>

      {/* Improved Loading Overlay for Image Capture with Progress */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-lg font-medium mb-2">Capturing full page image...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${captureProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {captureProgress < 30 && "Calculating component boundaries..."}
              {captureProgress >= 30 && captureProgress < 60 && "Processing content..."}
              {captureProgress >= 60 && captureProgress < 90 && "Generating image..."}
              {captureProgress >= 90 && "Finishing up..."}
            </p>
          </div>
        </div>
      )}

      {/* Code Display Modal */}
      {(generatedCode || generatedJSX) && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Generated Code</h2>

            {/* Tab Navigation */}
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 ${activeTab === "html" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("html")}
              >
                HTML
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === "jsx" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("jsx")}
              >
                JSX / React
              </button>
            </div>

            {/* Code Display */}
            <div className="relative bg-gray-100 p-4 rounded text-sm border overflow-auto font-mono flex-grow">
              <pre className="whitespace-pre-wrap break-words">
                <code>{isFormatting ? "Formatting..." : (activeTab === "html" ? generatedCode : generatedJSX)}</code>
              </pre>
            </div>

            {/* Share Link Display (if available) */}
            {shareLink && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Shareable Link</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={shareLink} 
                    readOnly 
                    className="flex-1 p-2 border rounded bg-gray-50 text-sm"
                  />
                  <button 
                    onClick={copyShareLink} 
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button 
                onClick={copyToClipboard} 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <Copy size={16} className="mr-1" />
                Copy {activeTab.toUpperCase()}
              </button>
              <button 
                onClick={downloadCode} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download size={16} className="mr-1" />
                Download
              </button>
              <button 
                onClick={() => {
                  setGeneratedCode("");
                  setGeneratedJSX("");
                  setShareLink("");
                }} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}