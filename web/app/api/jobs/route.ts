import { NextResponse } from "next/server";

// Temporary in-memory storage for demo purposes
let jobs: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
    if (companyId) {
      const companyJobs = jobs.filter(j => j.companyId === companyId);
      return NextResponse.json(companyJobs);
    }
    
    return NextResponse.json(jobs);
  } catch (e) {
    console.error("GET jobs error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, requiredSkills, location, minExperience, industry, companyId } = body ?? {};
    
    if (!title || !description || !Array.isArray(requiredSkills) || requiredSkills.length === 0 || !location || !companyId) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    const jobData = {
      id: `job_${Date.now()}`,
      title,
      description,
      requiredSkills,
      location,
      minExperience: Number(minExperience) || 0,
      industry: industry || null,
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      company: { id: companyId, name: "Demo Company", location: location }
    };
    
    jobs.push(jobData);
    
    return NextResponse.json(jobData, { status: 201 });
  } catch (e) {
    console.error("Job creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
