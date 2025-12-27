import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const company = await prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        location: true,
        description: true,
        website: true,
        companySize: true,
        foundedYear: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json({ error: "Failed to get company" }, { status: 500 });
  }
}

import { hashPassword, validatePassword } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password, industry, location, description, website, companySize, foundedYear } = body;

    const updateData: any = {};

    // Update basic fields if provided
    if (name !== undefined) updateData.name = name;
    if (industry !== undefined) updateData.industry = industry;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (companySize !== undefined) updateData.companySize = companySize;
    if (foundedYear !== undefined) updateData.foundedYear = foundedYear;

    // Handle email update
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existing = await prisma.company.findUnique({ where: { email } });
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

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        location: true,
        description: true,
        website: true,
        companySize: true,
        foundedYear: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Update company error:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete all related data in correct order (cascade delete)
    // 1. Get all jobs from this company
    const jobs = await prisma.job.findMany({
      where: { companyId: id },
      select: { id: true }
    });

    const jobIds = jobs.map(job => job.id);

    // 2. Delete all messages in chats related to these jobs
    await prisma.message.deleteMany({
      where: {
        chat: {
          jobId: { in: jobIds }
        }
      }
    });

    // 3. Delete all chats related to these jobs
    await prisma.chat.deleteMany({
      where: {
        jobId: { in: jobIds }
      }
    });

    // 4. Delete all interests for these jobs
    await prisma.interest.deleteMany({
      where: {
        jobId: { in: jobIds }
      }
    });

    // 5. Delete all jobs
    await prisma.job.deleteMany({
      where: { companyId: id }
    });

    // 6. Finally delete the company
    await prisma.company.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}

