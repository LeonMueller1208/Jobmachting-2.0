import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      const existing = await prisma.applicant.findUnique({ where: { email } });
      return NextResponse.json(existing ?? null);
    }
    
    const applicants = await prisma.applicant.findMany({ 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(applicants);
  } catch (e) {
    console.error("GET applicants error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, skills, location, experience, education, bio, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility } = body ?? {};
    
    if (!email || !name || !Array.isArray(skills) || skills.length === 0 || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    const upserted = await prisma.applicant.upsert({
      where: { email },
      update: { 
        name, 
        skills, 
        location, 
        experience: Number(experience) || 0, 
        education: education || null,
        bio: bio || null, 
        industry: industry || null,
        hierarchy: hierarchy ? Number(hierarchy) : null,
        autonomy: autonomy ? Number(autonomy) : null,
        teamwork: teamwork ? Number(teamwork) : null,
        workStructure: workStructure ? Number(workStructure) : null,
        feedback: feedback ? Number(feedback) : null,
        flexibility: flexibility ? Number(flexibility) : null
      },
      create: { 
        email, 
        name, 
        skills, 
        location, 
        experience: Number(experience) || 0, 
        education: education || null,
        bio: bio || null, 
        industry: industry || null,
        hierarchy: hierarchy ? Number(hierarchy) : null,
        autonomy: autonomy ? Number(autonomy) : null,
        teamwork: teamwork ? Number(teamwork) : null,
        workStructure: workStructure ? Number(workStructure) : null,
        feedback: feedback ? Number(feedback) : null,
        flexibility: flexibility ? Number(flexibility) : null
      },
    });
    
    return NextResponse.json(upserted, { status: 201 });
  } catch (e) {
    console.error("Applicant creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
