"use client"

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { Header } from '@/components/Header';
import { ComponentLibrary } from '@/components/ComponentLibrary';
import { AIAssistant } from '@/components/AIAssistant';
import { useComponentStore } from '@/store/componentStore';
import { Layers, Palette, Zap, Monitor, Smartphone, Tablet } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'components' | 'layers' | 'ai'>('components');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);
  const { selectedComponentId } = useComponentStore();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
          <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex border-b overflow-x-auto scrollbar-hide border-gray-200">
            <button 
              className={`flex-1 py-1 px-4 text-sm font-medium ${activeTab === 'components' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('components')}
            >
              <div className="flex items-center justify-center">
                <Palette size={16} className="mr-2" />
                Components
              </div>
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'layers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('layers')}
            >
              <div className="flex items-center justify-center">
                <Layers size={16} className="mr-2" />
                Layers
              </div>
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('ai')}
            >
              <div className="flex items-center justify-center">
                <Zap size={16} className="mr-2" />
                AI
              </div>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'components' && <ComponentLibrary />}
            {activeTab === 'layers' && <Sidebar />}
            {activeTab === 'ai' && <AIAssistant />}
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b  border-gray-200 p-2 flex justify-center">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
              <button 
                className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('desktop')}
                title="Desktop view"
              >
                <Monitor size={20} />
              </button>
              <button 
                className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('tablet')}
                title="Tablet view"
              >
                <Tablet size={20} />
              </button>
              <button 
                className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('mobile')}
                title="Mobile view"
              >
                <Smartphone size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center items-center">
            <Canvas viewMode={viewMode} />
          </div>
        </div>
        
        {/* Right Property Panel */}
        {showPropertyPanel && (
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertyPanel 
              onClose={() => setShowPropertyPanel(false)} 
            />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;