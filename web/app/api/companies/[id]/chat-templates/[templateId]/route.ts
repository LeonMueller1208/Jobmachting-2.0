import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/companies/[id]/chat-templates/[templateId]
 * Update a chat template
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; templateId: string }> }
) {
  try {
    const { id: companyId, templateId } = await params;
    const body = await request.json();
    const { name, content } = body;

    if (!companyId || !templateId) {
      return NextResponse.json(
        { error: "Company ID and Template ID are required" },
        { status: 400 }
      );
    }

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    // Check if template exists and belongs to company
    const existingTemplate = await prisma.chatTemplate.findFirst({
      where: {
        id: templateId,
        companyId: companyId,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Don't allow editing default templates
    if (existingTemplate.isDefault) {
      return NextResponse.json(
        { error: "Default templates cannot be edited" },
        { status: 403 }
      );
    }

    // Update template
    const template = await prisma.chatTemplate.update({
      where: { id: templateId },
      data: {
        name: name.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating chat template:", error);
    return NextResponse.json(
      {
        error: "internal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/companies/[id]/chat-templates/[templateId]
 * Delete a chat template
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; templateId: string }> }
) {
  try {
    const { id: companyId, templateId } = await params;

    if (!companyId || !templateId) {
      return NextResponse.json(
        { error: "Company ID and Template ID are required" },
        { status: 400 }
      );
    }

    // Check if template exists and belongs to company
    const existingTemplate = await prisma.chatTemplate.findFirst({
      where: {
        id: templateId,
        companyId: companyId,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting default templates
    if (existingTemplate.isDefault) {
      return NextResponse.json(
        { error: "Default templates cannot be deleted" },
        { status: 403 }
      );
    }

    // Delete template
    await prisma.chatTemplate.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat template:", error);
    return NextResponse.json(
      {
        error: "internal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

