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
    const { email, name, skills, location, experience, bio, industry } = body ?? {};
    
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
        bio: bio || null, 
        industry: industry || null 
      },
      create: { 
        email, 
        name, 
        skills, 
        location, 
        experience: Number(experience) || 0, 
        bio: bio || null, 
        industry: industry || null 
      },
    });
    
    return NextResponse.json(upserted, { status: 201 });
  } catch (e) {
    console.error("Applicant creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
