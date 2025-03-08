import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

// In-memory store for shared previews
const sharedPreviews = new Map();

export async function POST(request: NextRequest) {
  try {
    // Log the request content type for debugging
    console.log("Content-Type:", request.headers.get("content-type"));
    
    // Handle JSON parsing errors explicitly
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    const { html, components } = body;
    
    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for this preview
    const shareId = uuidv4().slice(0, 8);
    
    // Store the preview data
    sharedPreviews.set(shareId, {
      html,
      components: components || [],
      createdAt: new Date().toISOString()
    });
    
    // Log successful storage for debugging
    console.log(`Preview stored with ID: ${shareId}`);
    
    // Get origin safely
    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const shareUrl = `${origin}/preview/share/${shareId}`;
    
    return NextResponse.json({ 
      shareId, 
      shareUrl,
      expiresIn: "24 hours"
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process request", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Preview ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`Retrieving preview with ID: ${id}`);
    console.log(`Available IDs: ${Array.from(sharedPreviews.keys()).join(', ')}`);
    
    const preview = sharedPreviews.get(id);
    
    if (!preview) {
      return NextResponse.json(
        { error: "Preview not found or has expired" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(preview);
  } catch (error) {
    console.error("Server error in GET:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}