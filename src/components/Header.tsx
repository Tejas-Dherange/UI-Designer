import { useState } from "react";
import { Save, Play, Share2, Copy, Link } from "lucide-react";
import { useComponentStore } from "../store/componentStore";
import { useRouter } from "next/navigation";


export const Header: React.FC = () => {
  const { components } = useComponentStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"jsx" | "html" | "json">("jsx");
  const [useTailwind, setUseTailwind] = useState(true);
  const [shareableLink, setShareableLink] = useState<string | null>(null);

  // ✅ Generate JSX Code (Preserves Exact Component Structure)
  const getJSXCode = () => {
    if (components.length === 0) return "// No components to display";

    return components
      .map((c) => {
        let propsString = Object.entries(c.props || {})
          .map(([key, value]) => {
            if (typeof value === "string") return `${key}="${value}"`;
            if (typeof value === "boolean" && value) return key;
            return `${key}={${JSON.stringify(value)}}`;
          })
          .join(" ");

        return `<${c.type} ${propsString}>${c.props.children || ""}</${c.type}>`;
      })
      .join("\n");
  };

  const router=useRouter();
  const handlePreview = () => {
    // ✅ Save the component tree in localStorage
    localStorage.setItem("canvasComponents", JSON.stringify(components));
  
    // ✅ Navigate to the preview page
    router.push("/dashboard/preview");
  };
  
  
  const saveProject = async () => {
    try {
      const name = prompt("Enter project name:");
      if (!name) {
        alert("❌ Project name is required!");
        return;
      }
  
      const type = prompt("Enter project type (e.g., Web, Mobile, UI Design, etc.):");
      if (!type) {
        alert("❌ Project type is required!");
        return;
      }
  
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type, // ✅ Include type field
          userId: "12345", // ✅ Ensure "userId" is included
          components, // ✅ Ensure "components" is an array
        }),
      });
  
      const data = await response.json();
      console.log("📡 API Response:", data);
  
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
  
  

  // ✅ Generate Properly Structured HTML + CSS
  const getHTMLCode = () => {
    if (components.length === 0) return "<!-- No components to display -->";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared UI</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 800px; margin: auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
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

  // ✅ Generate JSON Code (Correct Format)
  const getJSONCode = () => JSON.stringify(components, null, 2);

  // ✅ Get active format code
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

  // ✅ Copy to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveCode());
    alert("Copied to clipboard!");
  };

  // ✅ Generate Shareable Link
  const generateShareableLink = () => {
    localStorage.setItem("sharedComponents", getJSONCode());
    const url = `${window.location.origin}/shared?data=local`;
    setShareableLink(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="text-blue-600 font-bold text-xl">UI Designer</div>

        <div className="flex items-center space-x-2">
          <button onClick={handlePreview} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
            <Play size={16} className="mr-1" />
            Preview
          </button>
          <button onClick={saveProject} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <Save size={16} className="mr-1" />
            Save
          </button>
          <button
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setIsPopupOpen(true)}
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* Share Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Export Code</h2>

            {/* Tab Buttons */}
            <div className="flex border-b mb-2">
              {["jsx", "html", "json"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFormat(tab as "jsx" | "html" | "json")}
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
              <button onClick={copyToClipboard} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white bg-opacity-70 rounded">
                <Copy size={16} />
              </button>
            </div>

            {/* Shareable Link */}
            <button onClick={generateShareableLink} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center mt-4">
              <Link size={16} className="mr-2" />
              Generate Shareable Link
            </button>

            {/* Copy Shareable Link */}
            {shareableLink && (
              <div className="mt-3 bg-gray-100 p-2 rounded text-sm flex items-center justify-between">
                <input type="text" value={shareableLink} readOnly className="w-full bg-white p-1 border rounded text-gray-700" />
                <button onClick={() => navigator.clipboard.writeText(shareableLink)} className="ml-2 text-blue-600 hover:underline">
                  Copy
                </button>
              </div>
            )}

            <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-4 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
