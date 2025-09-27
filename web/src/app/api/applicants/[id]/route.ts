import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, skills, location, experience, bio, industry } = await request.json();
    
    const updatedApplicant = await prisma.applicant.update({
      where: { id: params.id },
      data: {
        name,
        skills,
        location,
        experience: Number(experience),
        bio: bio || null,
        industry: industry || null,
      },
    });

    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Update applicant error:", error);
    return NextResponse.json({ error: "Failed to update applicant" }, { status: 500 });
  }
}
