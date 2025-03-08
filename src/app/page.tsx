"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Facebook, Instagram, Layers, Twitter } from "lucide-react"; // Importing icons
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const features = [
  { title: "Drag-and-Drop Editor", description: "Easily add, arrange, and resize elements with our intuitive interface. Save time and effort by quickly creating stunning UI components.", image: "/drag-and-drop.jpg" },
  { title: "AI-Powered Code Generation", description: "Generate optimized and efficient code snippets with AI assistance, reducing development time.", image: "/ai.jpg" },
  { title: "Real-Time Preview", description: "Instantly see and interact with your designs as you build them. Get instant feedback and make changes on the go for better efficiency.", image: "/preview.jpg" },
  { title: "Design Language System", description: "Maintain consistency across your project with a structured design language system, ensuring a cohesive look and feel.", image: "/ui-component.jpg" },
  { title: "Project Management System", description: "Manage your UI projects efficiently with built-in collaboration and workflow management tools.", image: "/project-management.jpg" }
];

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black overflow-auto">
      <header className="sticky top-0 z-50 w-full border-b bg-gray-200 shadow-lg">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform">
            <Layers className="h-6 w-6 text-black" />
            <span>UI Maker Pro</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">Login</Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 shadow-lg transition-transform transform hover:scale-105">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center py-24 space-y-10">
        <div className="max-w-3xl space-y-6 animate-fade-in">
          <h1 className="text-5xl font-extrabold sm:text-6xl drop-shadow-lg text-indigo-600">Build Stunning UI Components with AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Drag, drop, and customize beautiful UI elements instantly with AI-powered suggestions and code generator.</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-110 hover:bg-indigo-700">Get Started <ArrowRight className="h-5 w-5 ml-2 inline" /></button>
            </Link>
            <Link href="/demo">
              <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:bg-indigo-100">View Demo</button>
            </Link>
          </div>
        </div>
        <section className="py-12 text-center bg-gray-100 w-full">
          <h2 className=" py-4 text-4xl font-bold ">About Us</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            UI Maker Pro is your go-to solution for building stunning user interfaces effortlessly. Our platform leverages AI technology to streamline the design process, allowing you to focus on creativity while we handle the technical details.
          </p>
        </section>
      </main>
      <section className=" text-center bg-gray-0">
        <h2 className="text-4xl font-bold mb-6">Key Features</h2>
      </section>
      {features.map((feature, index) => (
  <section 
    key={index} 
    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
    items-center justify-between py-12 gap-10 px-6 bg-gray-200 transition-all duration-300 hover:bg-gray-100`}
  >          
    <div className="w-full md:w-1/2 p-4 rounded-lg shadow-lg bg-white overflow-hidden">
      <div className="relative w-full h-64 md:h-80">
        <Image 
          src={feature.image} 
          alt={feature.title} 
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-300 hover:scale-105" 
          priority 
        />
      </div>
    </div>
    <div className="w-full md:w-1/2 text-center md:text-left p-6">
      <h2 className="text-3xl font-bold mb-4 text-indigo-600">{feature.title}</h2>
      <p className="text-lg text-gray-700">{feature.description}</p>
    </div>
  </section>
))}
      <footer className="text-center py-6 bg-indigo-600 text-white">
        <p className="text-lg font-mono">&copy; 2024 UI Maker Pro. All rights reserved.</p>
        <p className="mt-2">Your go-to solution for building stunning UI components.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="/about" className="text-white hover:underline"><Layers className="inline h-4 w-4 mr-1" />About Us</Link> | 
          <Link href="/contact" className="text-white hover:underline"><Layers className="inline h-4 w-4 mr-1" />Contact</Link> | 
          <Link href="/privacy" className="text-white hover:underline"><Layers className="inline h-4 w-4 mr-1" />Privacy Policy</Link>
        </div>
        <div className="mt-4">
          <p>Follow us on:</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-white hover:underline"><Facebook className="inline h-4 w-4 mr-1" />Facebook</a> | 
            <a href="#" className="text-white hover:underline"><Twitter className="inline h-4 w-4 mr-1" />Twitter</a> | 
            <a href="#" className="text-white hover:underline"><Instagram className="inline h-4 w-4 mr-1" />Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
