import { dbconnect } from "@/dbConfig/dfConfig"; // Ensure correct path
import { Project } from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("📡 Connecting to MongoDB...");
    await dbconnect();
    console.log("✅ Connected to MongoDB");

    const body = await req.json();
    console.log("📥 Parsed Body:", body);

    // ✅ Fix Validation (Remove "content" check)
    if (!body.name || !body.userId || !Array.isArray(body.components)) {
      console.error("❌ Validation Error: Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, userId, and components must be an array" },
        { status: 400 }
      );
    }

    // ✅ Save to Database
    const newProject = new Project({
      name: body.name,
      userId: body.userId,
      components: body.components,
    });

    await newProject.save();
    console.log("✅ Project Saved Successfully!");

    return NextResponse.json({
      success: true,
      message: "Project saved successfully!",
    });
  } catch (error: any) {
    console.error("❌ Error Saving Project:", error.message);
    return NextResponse.json(
      { success: false, message: `Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbconnect(); // ✅ Connect to MongoDB
    const projects = await Project.find().sort({ createdAt: -1 }); // ✅ Fetch all projects (latest first)

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("❌ Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching projects." },
      { status: 500 }
    );
  }
}