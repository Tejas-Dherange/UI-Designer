import { Component } from "lucide-react";
import { ComponentType } from "../types/component";

const linkStyle = {
  color: "#CCCCCC",
  fontSize: "16px",
  cursor: "pointer",
  transition: "color 0.3s",
  ':hover': { color: "#FFFFFF" },
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: "#0EA5E9",
  padding: "6px 14px",
  borderRadius: "20px",
  color: "#FFFFFF",
};

export const templates = [
  
  {
    id: "template-1",
    name: "Basic Layout",
    components: [
      // Navbar with logo, menu, and button
      {
        id: "comp-1",
        type: "navbar" as ComponentType,
        props: {
          style: { 
            position: "absolute", 
            top: "0%", 
            left: "0%", 
            width: "100%", 
            height: "10vh", 
            backgroundColor: "rgb(164,197,249)", 
            color: "#FFFFFF", 
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2%"
          },
          children: [
            { type: "text", props: { children: "MyBrand", style: { fontSize: "1.5rem", fontWeight: "bold" } } },
            { type: "menu", props: { items: ["Home", "About", "Services", "Contact"], style: { display: "flex", gap: "1.5vw" } } },
            { type: "button", props: { children: "Sign Up", style: { backgroundColor: "#4F46E5", padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer" } } }
          ],
        },
      },
      // Impressive Bold Text (Right-Aligned)
      {
        id: "comp-2",
        type: "text" as ComponentType,
        props: {
          style: { 
            position: "absolute", 
            width:"80%",
            top: "15%", 
            left:"5%", 
            fontSize: "2vw", 
            fontWeight: "bold", 
            color: "#FF6B6B" 
          },
          children: "Create Stunning UI Components Effortlessly!",
        },
      },
      // Image Gallery (Three Images in a Row)
      {
        id: "comp-3",
        type: "image" as ComponentType,
        props: {
          style: { position: "absolute", top: "30%", left: "10%", width: "12vw", height: "8vw", borderRadius: "5px" },
          src: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      },
      {
        id: "comp-4",
        type: "image" as ComponentType,
        props: {
          style: { position: "absolute", top: "30%", left: "35%", width: "12vw", height: "8vw", borderRadius: "5px" },
          src: "https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      },
      {
        id: "comp-5",
        type: "image" as ComponentType,
        props: {
          style: { position: "absolute", top: "30%", left: "60%", width: "12vw", height: "8vw", borderRadius: "5px" },
          src: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      },
      // Image Names Below
      {
        id: "comp-6",
        type: "text" as ComponentType,
        props: {
          style: { position: "absolute", top: "70%", left: "20%", fontSize: "1vw", fontWeight: "bold" },
          children: "UI Design",
        },
      },
      {
        id: "comp-7",
        type: "text" as ComponentType,
        props: {
          style: { position: "absolute", top: "70%", left: "45%", fontSize: "1vw", fontWeight: "bold" },
          children: "Component Library",
        },
      },
      {
        id: "comp-8",
        type: "text" as ComponentType,
        props: {
          style: { position: "absolute", top: "70%", left: "70%", fontSize: "1vw", fontWeight: "bold" },
          children: "Custom Elements",
        },
      },
      // Footer with Copyright
      {
        id: "comp-9",
        type: "text" as ComponentType,
        props: {
          style: { 
            position: "absolute", 
            top:"80%",
            left: "0%", 
            width: "100%", 
            height: "8vh", 
            backgroundColor: "#1E293B", 
            color: "#FFFFFF", 
            textAlign: "center", 
            padding: "1.5vh"
          },
          children: "© 2025 MyBrand. All rights reserved. | Privacy Policy | Terms of Service",
        },
      },
    ],
  },
  {
    id: "template-2",
    name: "Login Form",
    components: [
      // Background for Login Page
      {
        id: "comp-1",
        type: "div" as ComponentType,
        props: {
          style: { 
            position: "absolute", 
            top: "0%", 
            left: "0%", 
            width: "100%", 
            height: "100vh",
            background: "linear-gradient(to right,rgb(177, 179, 186),rgb(240, 240, 248))", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
        },
      },
      
      {
        id: "comp-3",
        type: "text" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "2vw", 
            fontWeight: "bold", 
            color: "#333" 
          },
          children: "Welcome Back!",
        },
      },
      // Email Input Field
      {
        id: "comp-4",
        type: "input" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "28%",
            left: "28%",
            transform: "translateX(-50%)",
            width: "80%", 
            padding: "1vw", 
            borderRadius: "1vw", 
            border: "1px solid #ccc", 
            boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "0.3s",
          },
          type: "email",
          placeholder: "Enter your email",
          onFocus: { boxShadow: "0px 0px 1vw rgba(79, 70, 229, 0.5)" },
        },
      },
      // Password Input Field
      {
        id: "comp-5",
        type: "input" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "42%",
            left: "28%",
            transform: "translateX(-50%)",
            width: "80%", 
            padding: "1vw", 
            borderRadius: "1vw", 
            border: "1px solid #ccc", 
            boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "0.3s",
          },
          type: "password",
          placeholder: "Enter your password",
          onFocus: { boxShadow: "0px 0px 1vw rgba(79, 70, 229, 0.5)" },
        },
      },
      // Submit Button
      {
        id: "comp-6",
        type: "button" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "61%",
            left: "30%",
            transform: "translateX(-50%)",
            width: "65%", 
            padding: "1vw", 
            background: "linear-gradient(to right, #4F46E5, #3B82F6)", 
            color: "white", 
            border: "none", 
            borderRadius: "1vw",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          },
          children: "Login",
          onHover: { background: "linear-gradient(to right, #4338CA, #2563EB)", transform: "scale(1.05)" },
        },
      },
      // Forgot Password Link
      {
        id: "comp-7",
        type: "text" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "75%",
            left: "38%",
            transform: "translateX(-50%)",
            fontSize: "1vw", 
            color: "#4F46E5", 
            cursor: "pointer" 
          },
          children: "Forgot Password?",
        },
      },
      // Register Link
      {
        id: "comp-8",
        type: "text" as ComponentType,
        props: {
          style: { 
            position: "absolute",
            top: "73%",
            left: "62%",
            transform: "translateX(-50%)",
            fontSize: "1vw", 
            color: "#4F46E5", 
            cursor: "pointer" 
          },
          children: "Create an account",
        },
      },
    ],
  }
,
  
  
{
  id: "template-3",
  name: "Contact Us",
  components: [
    // Main container
    {
      id: "comp-1",
      type: "div" as ComponentType,
      props: {
        style: {
          position: "absolute",
          top: "2%",
          left: "28%",
          transform: "translateX(-50%)",
          width: "80%",
          height:"40%",
          textAlign: "center",
          backgroundColor:"rgb(200,192,192)",
        },
      },
    },

    // Title
    {
      id: "comp-2",
      type: "text" as ComponentType,
      props: {
        style: { 
          fontSize: "2vw",
          fontWeight: "bold",
          top: "6%",
          left: "40%",
          width:"80%",
          transform: "translateX(-50%)",
          position: "absolute"
        },
        children: "Contact Us",
      },
    },

    // Subtitle
    {
      id: "comp-3",
      type: "text" as ComponentType,
      props: {
        style: { 
          fontSize: "1vw", 
          color: "#4B5563", 
          top: "23%",
          left: "30%",
          width:"80%",
          transform: "translateX(-50%)",
          position: "absolute",
         
          textAlign: "center",
        },
        children: "We'd love to hear from you! Fill out the form below or contact us directly.",
      },
    },

    // Name Input
    {
      id: "comp-5",
      type: "input" as ComponentType,
      props: {
        type: "text",
        placeholder: "Your Name",
        style: {
          border: "1px solid #CCC",
          padding: "1vw",
          top:"27%",
          left:"17%",
          width: "80%",
          marginBottom: "1vw",
          borderRadius: "0.5vw",
        },
      },
    },

    // Email Input
    {
      id: "comp-6",
      type: "input" as ComponentType,
      props: {
        type: "email",
        placeholder: "Your Email",
        style: {
          border: "1px solid #CCC",
          padding: "1vw",
          width: "80%",
          left:"17%",
          top:"42%",
          marginBottom: "1vw",
          borderRadius: "0.5vw",
        },
      },
    },

    // Message Textarea
    {
      id: "comp-7",
      type: "text" as ComponentType,
      props: {
        placeholder: "Your Message",
        style: {
          border: "1px solid #CCC",
          padding: "1vw",
          width: "80%",
          left:"17%",
          top:"56%",
          height: "10vh",
          borderRadius: "0.5vw",
          marginBottom: "1vw",
        },
      },
    },

    // Send Button
    {
      id: "comp-8",
      type: "button" as ComponentType,
      props: {
        children: "Send Message",
        style: {
          top:"73%",
          left:"17%",
          backgroundColor: "#2563EB",
          color: "#FFF",
          padding: "1vw",
          borderRadius: "0.5vw",
          width: "80%",
          cursor: "pointer",
          marginTop: "1vw"
        },
      },
    },

    // Office Location
    {
      id: "comp-9",
      type: "text" as ComponentType,
      props: {
        style: { 
          fontSize: "1vw", 
          color: "#4B5563", 
          top: "88%",
          left: "28%",
          transform: "translateX(-50%)",
          position: "absolute",
          textAlign: "center",
          width: "80%"
        },
        children: "📍 Our Office: 123 Street, City, Country",
      },
    },

    // Contact Details
    {
      id: "comp-10",
      type: "text" as ComponentType,
      props: {
        style: { 
          fontSize: "1vw", 
          color: "#4B5563",
          top: "97%",
          left: "25%",
          transform: "translateX(-50%)",
          position: "absolute",
          textAlign: "center",
          width: "80%"
        },
        children: "📞 Call Us: +123 456 7890 | ✉️ Email: contact@example.com",
      },
    },

    // Footer
    {
      id: "comp-11",
      type: "text" as ComponentType,
      props: {
        style: { 
          fontSize: "1vw", 
          color: "#4B5563",
          top: "110%",
          left: "25%",
          transform: "translateX(-50%)",
          position: "absolute",
          textAlign: "center",
          width: "80%"
        },
        children: "© 2025 Company Name. All rights reserved.",
      },
    },
  ],
},

  
  {
    id: "template-4",
    name: "Navigation Bar",
    components: [
      // Navbar Container
      {
        id: "comp-1",
        type: "div" as ComponentType,
        props: {
          style: {
            position: "absolute",
            top: "0%",
            left: "25%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "40%",
            backgroundColor: "#1E1E1E", // Dark background
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            borderBottom: "3px solid #2563EB" // Light blue border-bottom
          },
        },
      },
  
      // Navigation Links Container
      {
        id: "comp-2",
        type: "div" as ComponentType,
        props: {
          style: {
            display: "flex",
            gap: "20px",
            top:"3.5%",
            left:"72%",
          },
        },
      },
  
      // Navigation Links
      {
        id: "link-1",
        type: "text" as ComponentType,
        props: { children: "Services", style:{ ...linkStyle ,left:"10%",top:"4.5%" }},
      },
      {
        id: "link-2",
        type: "text" as ComponentType,
        props: { children: "Projects", style:{ ...linkStyle,left:"20%",top:"4.5%" } },
      },
      {
        id: "link-3",
        type: "text" as ComponentType,
        props: { children: "About", style: {...linkStyle ,left:"30%",top:"4.5%" }},
      },
      {
        id: "link-4",
        type: "text" as ComponentType,
        props: { children: "Contact", style:{... activeLinkStyle,left:"40%",top:"3.5%" }},
      },
  
      // Logo
      {
        id: "comp-3",
        type: "text" as ComponentType,
        props: {
          children: "LOGOBAKERY",
          style: {
            top:"3.5%",
            left:"79%",

            fontSize: "18px",
            fontWeight: "bold",
            color: "#FFFFFF",
            letterSpacing: "1px",
          },
        },
      },
    ],
  }
  
  
  
  
  
];