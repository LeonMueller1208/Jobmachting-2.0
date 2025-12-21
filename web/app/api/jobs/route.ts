import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
    if (companyId) {
      const jobs = await prisma.job.findMany({
        where: { companyId },
        include: { 
          company: {
            select: {
              id: true,
              name: true,
              location: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(jobs);
    }
    
    const jobs = await prisma.job.findMany({ 
      include: { 
        company: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      }, 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(jobs);
  } catch (e) {
    console.error("GET jobs error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Full error details:", JSON.stringify(e, null, 2));
    return NextResponse.json({ 
      error: "internal", 
      details: errorMessage,
      message: "Failed to fetch jobs"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, requiredSkills, location, minExperience, requiredEducation, jobType, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility, companyId } = body ?? {};
    
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
        requiredEducation: requiredEducation || null,
        jobType: jobType || null,
        industry: industry || null,
        hierarchy: hierarchy ? Number(hierarchy) : null,
        autonomy: autonomy ? Number(autonomy) : null,
        teamwork: teamwork ? Number(teamwork) : null,
        workStructure: workStructure ? Number(workStructure) : null,
        feedback: feedback ? Number(feedback) : null,
        flexibility: flexibility ? Number(flexibility) : null,
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
