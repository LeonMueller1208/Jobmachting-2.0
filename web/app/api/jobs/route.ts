import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
    if (companyId) {
      const jobs = await prisma.job.findMany({
        where: { companyId },
        include: { company: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(jobs);
    }
    
    const jobs = await prisma.job.findMany({ 
      include: { company: true }, 
      orderBy: { createdAt: "desc" } 
    });
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
    
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requiredSkills,
        location,
        minExperience: Number(minExperience) || 0,
        industry: industry || null,
        companyId,
      },
      include: { company: true },
    });
    
    return NextResponse.json(job, { status: 201 });
  } catch (e) {
    console.error("Job creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
