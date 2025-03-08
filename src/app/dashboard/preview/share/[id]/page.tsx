// File: app/preview/share/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// This page displays a shared preview
export default function SharedPreviewPage() {
  const params = useParams();
  const shareId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ html: string; components: any[] } | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/create-share?id=${shareId}`);
        
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        
        const data = await response.json();
        setPreview(data);
      } catch (err) {
        setError("Failed to load the shared preview. It may have expired or been removed.");
        console.error("Error fetching shared preview:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreview();
  }, [shareId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Loading Preview...</h2>
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Preview Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The requested preview could not be loaded."}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Render the preview
  return (
    <div className="min-h-screen">
      {/* Render the HTML content safely */}
      <div dangerouslySetInnerHTML={{ __html: preview.html }} />
      
      {/* Optional: Add a floating info badge */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-md opacity-70 hover:opacity-100 transition-opacity">
        Shared UI Preview
      </div>
    </div>
  );
}