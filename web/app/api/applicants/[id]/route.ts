import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, skills, location, experience, education, bio, industry } = await request.json();

    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        name,
        skills,
        location,
        experience: Number(experience),
        education: education || null,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete all related data in correct order (cascade delete)
    // 1. Delete all messages in chats where applicant is involved
    await prisma.message.deleteMany({
      where: {
        chat: {
          applicantId: id
        }
      }
    });

    // 2. Delete all chats
    await prisma.chat.deleteMany({
      where: { applicantId: id }
    });

    // 3. Delete all interests
    await prisma.interest.deleteMany({
      where: { applicantId: id }
    });

    // 4. Finally delete the applicant
    await prisma.applicant.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Applicant deleted successfully" });
  } catch (error) {
    console.error("Delete applicant error:", error);
    return NextResponse.json({ error: "Failed to delete applicant" }, { status: 500 });
  }
}
