import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      name, 
      email,
      password,
      skills, 
      location, 
      experience, 
      education, 
      bio, 
      industry,
      hierarchy,
      autonomy,
      teamwork,
      workStructure,
      feedback,
      flexibility
    } = body;

    const updateData: any = {};

    // Update basic fields if provided
    if (name !== undefined) updateData.name = name;
    if (skills !== undefined) updateData.skills = skills;
    if (location !== undefined) updateData.location = location;
    if (experience !== undefined) updateData.experience = Number(experience);
    if (education !== undefined) updateData.education = education || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (industry !== undefined) updateData.industry = industry || null;
    if (hierarchy !== undefined) updateData.hierarchy = hierarchy ? Number(hierarchy) : null;
    if (autonomy !== undefined) updateData.autonomy = autonomy ? Number(autonomy) : null;
    if (teamwork !== undefined) updateData.teamwork = teamwork ? Number(teamwork) : null;
    if (workStructure !== undefined) updateData.workStructure = workStructure ? Number(workStructure) : null;
    if (feedback !== undefined) updateData.feedback = feedback ? Number(feedback) : null;
    if (flexibility !== undefined) updateData.flexibility = flexibility ? Number(flexibility) : null;

    // Handle email update
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existing = await prisma.applicant.findUnique({ where: { email } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Diese E-Mail ist bereits registriert" }, { status: 409 });
      }
      updateData.email = email;
    }

    // Handle password update
    if (password !== undefined && password !== null && password !== "") {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: passwordValidation.error },
          { status: 400 }
        );
      }
      try {
        updateData.passwordHash = await hashPassword(password);
      } catch (error) {
        console.error("Password hashing error:", error);
        return NextResponse.json(
          { error: "Fehler beim Verschlüsseln des Passworts" },
          { status: 500 }
        );
      }
    }

    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        location: true,
        experience: true,
        education: true,
        bio: true,
        industry: true,
        hierarchy: true,
        autonomy: true,
        teamwork: true,
        workStructure: true,
        feedback: true,
        flexibility: true,
        createdAt: true,
        updatedAt: true,
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
