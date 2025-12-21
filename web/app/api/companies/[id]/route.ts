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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, industry, location, description, website, companySize, foundedYear } = await request.json();

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        name,
        email,
        industry,
        location,
        description: description !== undefined ? description : undefined,
        website: website !== undefined ? website : undefined,
        companySize: companySize !== undefined ? companySize : undefined,
        foundedYear: foundedYear !== undefined ? foundedYear : undefined,
      },
    });
    
    // Remove passwordHash from response
    const { passwordHash: _, ...companyWithoutPassword } = updatedCompany;
    return NextResponse.json(companyWithoutPassword);
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

