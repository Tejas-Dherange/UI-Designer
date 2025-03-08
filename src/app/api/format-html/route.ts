import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
    
    const { rawHtml } = body;
    
    if (!rawHtml) {
      return NextResponse.json(
        { error: "Raw HTML content is required" },
        { status: 400 }
      );
    }
    
    // Basic HTML formatting logic
    // In a production app, you might want to use a proper HTML formatter library
    // This is a simple approach that adds indentation and line breaks
    let formattedHtml = rawHtml;
    try {
      formattedHtml = formatHTML(rawHtml);
    } catch (formatError) {
      console.error("HTML formatting error:", formatError);
      // If formatting fails, return the original HTML
      formattedHtml = rawHtml;
    }
    
    return NextResponse.json({ formattedHtml });
  } catch (error) {
    console.error("Error formatting HTML:", error);
    return NextResponse.json(
      { 
        error: "Failed to format HTML", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// Simple HTML formatter function
function formatHTML(html: string): string {
  let formatted = '';
  let indent = 0;
  
  // Split by < to get tags and content
  const parts = html.split('<');
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length === 0) continue;
    
    // Add < back that was removed by split
    const part = '<' + parts[i];
    
    // Check if it's a closing tag
    if (part.indexOf('</') === 0) {
      indent--;
    }
    
    // Add indentation
    formatted += '\n' + ' '.repeat(indent * 2) + part;
    
    // Check if it's an opening tag (not self-closing)
    if (part.indexOf('<') === 0 && 
        part.indexOf('/>') === -1 && 
        part.indexOf('</') === -1 && 
        part.indexOf('<br') === -1 && 
        part.indexOf('<img') === -1 && 
        part.indexOf('<input') === -1 && 
        part.indexOf('<meta') === -1 && 
        part.indexOf('<link') === -1 && 
        part.indexOf('<hr') === -1) {
      indent++;
    }
  }
  
  return formatted.trim();
}