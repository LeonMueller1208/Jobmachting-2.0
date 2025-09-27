import { NextResponse } from "next/server";

// Temporary in-memory storage for demo purposes
let applicants: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      const existing = applicants.find(a => a.email === email);
      return NextResponse.json(existing ?? null);
    }
    
    return NextResponse.json(applicants);
  } catch (e) {
    console.error("GET applicants error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, skills, location, experience, bio, industry } = body ?? {};
    
    if (!email || !name || !Array.isArray(skills) || skills.length === 0 || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    // Check if applicant already exists
    const existingIndex = applicants.findIndex(a => a.email === email);
    
    const applicantData = {
      id: existingIndex >= 0 ? applicants[existingIndex].id : `applicant_${Date.now()}`,
      email,
      name,
      skills,
      location,
      experience: Number(experience) || 0,
      bio: bio || null,
      industry: industry || null,
      createdAt: existingIndex >= 0 ? applicants[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing
      applicants[existingIndex] = applicantData;
    } else {
      // Create new
      applicants.push(applicantData);
    }
    
    return NextResponse.json(applicantData, { status: 201 });
  } catch (e) {
    console.error("Applicant creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
