import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeMatchingScore, isPassing } from "@/lib/matching";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
    if (companyId) {
      const interests = await prisma.interest.findMany({
        where: { 
          job: { companyId }, 
          status: { in: ["INTERESTED", "COMPANY_REJECTED"] } // Include both active and archived
        },
        include: { 
          applicant: true, 
          job: true 
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(interests);
    }
    
    // Fallback: alle Interests zurückgeben
    const interests = await prisma.interest.findMany({ 
      include: { applicant: true, job: true }, 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(interests);
  } catch (error) {
    console.error("GET interests error:", error);
    return NextResponse.json({ error: "internal", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicantId, jobId, status } = body ?? {} as { applicantId: string; jobId: string; status: "INTERESTED" | "NOT_INTERESTED" };
    
    if (!applicantId || !jobId || !status) {
      return NextResponse.json({ error: "Fehlende Parameter: applicantId, jobId oder status" }, { status: 400 });
    }
    
    const [applicant, job] = await Promise.all([
      prisma.applicant.findUnique({ where: { id: applicantId } }),
      prisma.job.findUnique({ where: { id: jobId } }),
    ]);
    
    if (!applicant) {
      return NextResponse.json({ error: "Bewerber nicht gefunden" }, { status: 404 });
    }
    
    if (!job) {
      return NextResponse.json({ error: "Job nicht gefunden" }, { status: 404 });
    }

    const score = computeMatchingScore({
      applicant: { 
        skills: applicant.skills as string[], 
        experience: applicant.experience, 
        location: applicant.location,
        education: applicant.education || undefined,
        bio: applicant.bio || undefined,
        industry: applicant.industry || undefined
      },
      job: { 
        requiredSkills: job.requiredSkills as string[], 
        minExperience: job.minExperience, 
        location: job.location,
        requiredEducation: job.requiredEducation || undefined,
        title: job.title,
        description: job.description,
        industry: job.industry || undefined
      },
    });

    const passes = isPassing(score);

    const updated = await prisma.interest.upsert({
      where: { applicantId_jobId: { applicantId, jobId } },
      update: { status, matchScore: score, passes },
      create: { applicantId, jobId, status, matchScore: score, passes },
    });
    
    return NextResponse.json({ ...updated, passes });
  } catch (error) {
    console.error("POST interests error:", error);
    return NextResponse.json({ 
      error: "Fehler beim Verarbeiten der Anfrage", 
      details: error instanceof Error ? error.message : "Unbekannter Fehler" 
    }, { status: 500 });
  }
}
