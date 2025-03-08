import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useComponentStore } from '../store/componentStore';

interface PropertyPanelProps {
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ onClose }) => {
  const { selectedComponentId, components, updateComponent } = useComponentStore();
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    layout: true,
    appearance: true,
    typography: true,
    advanced: false,
  });

  const selectedComponent = components.find(c => c.id === selectedComponentId);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleHoverEffectChange = (effectType: string) => {
    if (!selectedComponent || !selectedComponent ) return;

    let updatedHoverStyles = {};

    switch (effectType) {
      case "hoverBg":
        updatedHoverStyles = { backgroundColor: "#f0f0f0" };
        break;
      case "hoverShadow":
        updatedHoverStyles = { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" };
        break;
      case "hoverBorder":
        updatedHoverStyles = { border: "2px solid #ff5733" };
        break;
      default:
        updatedHoverStyles = {};
    }

    updateComponent(selectedComponentId, {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        style: {
          ...selectedComponent.props.style,
          ":hover": updatedHoverStyles,
        },
      },
    });
  };

  const handleTypographyChange = (property: string, value: string) => {
    if (!selectedComponent) return;

    updateComponent(selectedComponentId, {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        style: {
          ...selectedComponent.props.style,
          [property]: value,
        },
      },
    });
  };

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedComponent) return;

    updateComponent(selectedComponentId, {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        style: {
          ...selectedComponent.props.style,
          [property]: value,
        },
      },
    });
  };

  const handleTextChange = (value: string) => {
    if (!selectedComponent) return;

    updateComponent(selectedComponentId, {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        children: value,
      },
    });
  };

  if (!selectedComponent) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Properties</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-500 text-center mt-8">Select a component to edit its properties</p>
      </div>
    );
  }

  return ( 
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Properties</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      <div className="text-sm text-gray-700 mb-4">
        {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)}
      </div>

      
     {/* Layout Section */}
<div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
  <button 
    className="w-full flex justify-between items-center p-3 bg-gray-50 text-left"
    onClick={() => toggleSection('layout')}
  >
    <span className="font-medium">Layout</span>
    {expandedSections.layout ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>

  {expandedSections.layout && (
    <div className="p-3 space-y-3">
      {/* Position */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Position</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.position || 'absolute'}
          onChange={(e) => handleStyleChange('position', e.target.value)}
        >
          <option value="absolute">Absolute</option>
          <option value="relative">Relative</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>

      {/* Width & Height */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.width || '40%'}
            onChange={(e) => handleStyleChange('width', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.height || ''}
            onChange={(e) => handleStyleChange('height', e.target.value)}
          />
        </div>
      </div>

      {/* Left & Top */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Left</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.left || ''}
            onChange={(e) => handleStyleChange('left', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Top</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.top || ''}
            onChange={(e) => handleStyleChange('top', e.target.value)}
          />
        </div>
      </div>

      {/* Additional Features */}
      {/* Z-Index */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Z-Index</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.zIndex || ''}
          onChange={(e) => handleStyleChange('zIndex', e.target.value)}
        />
      </div>

      {/* Overflow */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Overflow</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.overflow || 'visible'}
          onChange={(e) => handleStyleChange('overflow', e.target.value)}
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="scroll">Scroll</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      {/* Box Shadow */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Box Shadow</label>
        <input 
          type="text" 
          placeholder="e.g., 0px 4px 6px rgba(0,0,0,0.1)" 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.boxShadow || ''}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
        />
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Opacity</label>
        <input 
          type="range" 
          min="0" max="1" step="0.1"
          className="w-full"
          value={selectedComponent.props.style.opacity || '1'}
          onChange={(e) => handleStyleChange('opacity', e.target.value)}
        />
      </div>

     {/* Transform Section */}
<div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
  <button 
    className="w-full flex justify-between items-center p-3 bg-gray-50 text-left"
    onClick={() => toggleSection('transform')}
  >
    <span className="font-medium">Transform</span>
    {expandedSections.transform ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>

  {expandedSections.transform && (
    <div className="p-3 space-y-3">
      
      {/* Rotate */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Rotate (deg)</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.rotate || 0}
          onChange={(e) => handleStyleChange('rotate', `${e.target.value}deg`)}
        />
      </div>

      {/* Scale */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Scale</label>
        <input 
          type="number" step="0.1"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.scale || 1}
          onChange={(e) => handleStyleChange('scale', e.target.value)}
        />
      </div>

      {/* Skew */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Skew X (deg)</label>
          <input 
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.skewX || 0}
            onChange={(e) => handleStyleChange('skewX', `${e.target.value}deg`)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Skew Y (deg)</label>
          <input 
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.skewY || 0}
            onChange={(e) => handleStyleChange('skewY', `${e.target.value}deg`)}
          />
        </div>
      </div>

      {/* Translate */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Translate X (px)</label>
          <input 
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.translateX || 0}
            onChange={(e) => handleStyleChange('translateX', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Translate Y (px)</label>
          <input 
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.translateY || 0}
            onChange={(e) => handleStyleChange('translateY', `${e.target.value}px`)}
          />
        </div>
      </div>

    </div>
  )}
</div>


    </div>
  )}
</div>


   {/* Appearance Section */}
<div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
  <button 
    className="w-full flex justify-between items-center p-3 bg-gray-50 text-left"
    onClick={() => toggleSection('appearance')}
  >
    <span className="font-medium">Appearance</span>
    {expandedSections.appearance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>

  {expandedSections.appearance && (
    <div className="p-3 space-y-3">
      
      {/* Background Color */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Background Color</label>
        <input 
          type="color" 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        />
      </div>

      {/* Gradient Background */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Gradient Background</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.backgroundImage || 'none'}
          onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
        >
          <option value="none">None</option>
          <option value="linear-gradient(to right, #ff7e5f, #feb47b)">Linear</option>
          <option value="radial-gradient(circle, #ff7e5f, #feb47b)">Radial</option>
        </select>
      </div>

     {/* Hover Effects */}
<div>
  <label className="block text-xs text-gray-500 mb-1">Hover Effect</label>
  <select 
    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
    value={selectedComponent.props.hoverStyle || 'none'}
    onChange={(e) => handleHoverEffectChange(e.target.value)}
  >
    <option value="none">None</option>
    <option value="hoverBg">Background Change</option>
    <option value="hoverShadow">Shadow Effect</option>
    <option value="hoverBorder">Border Change</option>
  </select>
</div>




      {/* Cursor Style */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Cursor Style</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.cursor || 'default'}
          onChange={(e) => handleStyleChange('cursor', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="pointer">Pointer</option>
          <option value="grab">Grab</option>
          <option value="not-allowed">Not Allowed</option>
        </select>
      </div>

      {/* Padding & Margin */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Padding</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.padding || '0px'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Margin</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.margin || '0px'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
          />
        </div>
      </div>

      {/* Blur & Backdrop Filter */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Blur</label>
          <input 
            type="number" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.filter?.replace('blur(', '').replace('px)', '') || 0}
            onChange={(e) => handleStyleChange('filter', `blur(${e.target.value}px)`)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Backdrop Blur</label>
          <input 
            type="number" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.backdropFilter?.replace('blur(', '').replace('px)', '') || 0}
            onChange={(e) => handleStyleChange('backdropFilter', `blur(${e.target.value}px)`)}
          />
        </div>
      </div>

    </div>
  )}
</div>

   {/* Typography Section */}
<div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
  <button 
    className="w-full flex justify-between items-center p-3 bg-gray-50 text-left"
    onClick={() => toggleSection('typography')}
  >
    <span className="font-medium">Typography</span>
    {expandedSections.typography ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>
  
  {expandedSections.typography && (
    <div className="p-3 space-y-3">
      {(selectedComponent.type === 'text' || selectedComponent.type === 'button') && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Text</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.children || ''}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>
      )}

      {/* Font Size */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Size</label>
        <input 
          type="text" 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.fontSize || ''}
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.fontWeight || ''}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
          <option value="bolder">Bolder</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Color</label>
        <div className="flex">
          <input 
            type="color" 
            className="w-8 h-8 border border-gray-300 rounded mr-2"
            value={selectedComponent.props.style.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
          <input 
            type="text" 
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedComponent.props.style.color || ''}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Align</label>
        <select 
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.textAlign || ''}
          onChange={(e) => handleStyleChange('textAlign', e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Line Height</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.lineHeight || 'normal'}
          onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Letter Spacing</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.letterSpacing || 'normal'}
          onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
        />
      </div>

      {/* Text Decoration */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Decoration</label>
        <select
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.textDecoration || 'none'}
          onChange={(e) => handleStyleChange('textDecoration', e.target.value)}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Strikethrough</option>
          <option value="overline">Overline</option>
        </select>
      </div>

      {/* Text Transform */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Transform</label>
        <select
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.textTransform || 'none'}
          onChange={(e) => handleStyleChange('textTransform', e.target.value)}
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      {/* Text Shadow */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Shadow</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="e.g. 2px 2px 5px #000"
          value={selectedComponent.props.style.textShadow || ''}
          onChange={(e) => handleStyleChange('textShadow', e.target.value)}
        />
      </div>
    </div>
  )}
</div>



      
    {/* Advanced Section */}
<div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
  <button 
    className="w-full flex justify-between items-center p-3 bg-gray-50 text-left"
    onClick={() => toggleSection('advanced')}
  >
    <span className="font-medium">Advanced</span>
    {expandedSections.advanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>

  {expandedSections.advanced && (
    <div className="p-3 space-y-3">

      {/* Animations */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Animations</label>
        <select
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedComponent.props.style.animation || ''}
          onChange={(e) => handleStyleChange('animation', e.target.value)}
        >
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="bounce">Bounce</option>
          <option value="spin">Spin</option>
        </select>
      </div>

      {/* Transitions */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Transitions</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="e.g. all 0.3s ease-in-out"
          value={selectedComponent.props.style.transition || ''}
          onChange={(e) => handleStyleChange('transition', e.target.value)}
        />
      </div>

      {/* Custom Fonts */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Custom Font</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="e.g. Roboto, Arial"
          value={selectedComponent.props.style.fontFamily || ''}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
        />
      </div>

      {/* Dark Mode / Theme Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs text-gray-500">Dark Mode</label>
        <input
          type="checkbox"
          className="toggle-checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

    </div>
  )}
</div>


    </div>
  );
};