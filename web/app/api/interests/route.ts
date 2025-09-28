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
          status: "INTERESTED" 
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
  const body = await request.json();
  const { applicantId, jobId, status } = body ?? {} as { applicantId: string; jobId: string; status: "INTERESTED" | "NOT_INTERESTED" };
  const [applicant, job] = await Promise.all([
    prisma.applicant.findUnique({ where: { id: applicantId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);
  if (!applicant || !job) return NextResponse.json({ error: "Invalid applicant or job" }, { status: 400 });

  const score = computeMatchingScore({
    applicant: { 
      skills: applicant.skills as string[], 
      experience: applicant.experience, 
      location: applicant.location,
      bio: applicant.bio || undefined,
      industry: applicant.industry || undefined
    },
    job: { 
      requiredSkills: job.requiredSkills as string[], 
      minExperience: job.minExperience, 
      location: job.location,
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
}
