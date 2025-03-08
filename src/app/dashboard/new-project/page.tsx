"use client"

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { Header } from '@/components/Header';
import { ComponentLibrary } from '@/components/ComponentLibrary';
import { AIAssistant } from '@/components/AIAssistant';
import { useComponentStore } from '@/store/componentStore';
import { Layers, Palette, Zap, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<'components' | 'layers' | 'ai'>('components');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);
  const [projectName, setProjectName] = useState<string>('New Project');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { selectedComponentId, setComponents } = useComponentStore();
  
  // Get project ID from query params
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id');
  
  // Load project data if projectId exists
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        console.log("🔍 Loading project with ID:", projectId);
        
        const response = await fetch(`/api/projects?id=${projectId}`);
        const data = await response.json();
        
        if (data.success && data.project) {
          console.log("✅ Project loaded successfully:", data.project.name);
          
          // Set project name for display
          setProjectName(data.project.name || 'Untitled Project');
          
          // Load components into the component store
          if (data.project.components && Array.isArray(data.project.components)) {
            console.log(`📝 Loading ${data.project.components.length} components`);
            setComponents(data.project.components);
          }
        } else {
          console.error("❌ Failed to load project:", data.message);
        }
      } catch (error) {
        console.error("❌ Error loading project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, setComponents]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header projectName={projectName} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex border-b overflow-x-auto scrollbar-hide border-gray-200">
            {[
              { name: "components", icon: Palette, label: "Components" },
              { name: "layers", icon: Layers, label: "Layers" },
              { name: "ai", icon: Zap, label: "AI" },
            ].map(({ name, icon: Icon, label }) => (
              <button
                key={name}
                className={clsx(
                  "flex-1 py-1 px-4 text-sm font-medium",
                  activeTab === name
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setActiveTab(name)}
              >
                <div className="flex items-center justify-center">
                  <Icon size={16} className="mr-2" />
                  {label}
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'components' && <ComponentLibrary />}
            {activeTab === 'layers' && <Sidebar />}
            {activeTab === 'ai' && <AIAssistant />}
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-2 flex justify-center">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
              {[
                { mode: "desktop", icon: Monitor },
                { mode: "tablet", icon: Tablet },
                { mode: "mobile", icon: Smartphone },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  className={clsx(
                    "p-1 rounded",
                    viewMode === mode ? "bg-white shadow" : "hover:bg-gray-200"
                  )}
                  onClick={() => setViewMode(mode)}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center items-center">
            {loading ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">Loading project...</p>
              </div>
            ) : (
              <Canvas viewMode={viewMode} />
            )}
          </div>
        </div>
        
        {/* Right Property Panel */}
        {showPropertyPanel ? (
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertyPanel onClose={() => setShowPropertyPanel(false)} />
          </div>
        ) : (
          <button
            className="absolute right-4 bottom-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
            onClick={() => setShowPropertyPanel(true)}
            title="Show properties"
          >
            <Palette size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;