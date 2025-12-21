import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEMPLATES } from "@/lib/chatTemplates";

/**
 * GET /api/companies/[id]/chat-templates
 * Get all chat templates for a company
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Get all templates for this company
    let templates;
    try {
      templates = await prisma.chatTemplate.findMany({
        where: { companyId },
        orderBy: [
          { isDefault: "desc" }, // Default templates first
          { createdAt: "asc" }, // Then by creation date
        ],
      });
    } catch (error: any) {
      // If table doesn't exist, return empty array (migration might not be applied yet)
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        console.warn("ChatTemplate table does not exist yet, returning empty array");
        return NextResponse.json([]);
      }
      throw error;
    }

    // If no templates exist, try to create default ones
    if (templates.length === 0) {
      try {
        const createdTemplates = await Promise.all(
          DEFAULT_TEMPLATES.map((template) =>
            prisma.chatTemplate.create({
              data: {
                companyId,
                name: template.name,
                content: template.content,
                isDefault: template.isDefault,
              },
            })
          )
        );
        return NextResponse.json(createdTemplates);
      } catch (error: any) {
        // If table doesn't exist, return empty array
        if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
          console.warn("ChatTemplate table does not exist yet, returning empty array");
          return NextResponse.json([]);
        }
        throw error;
      }
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching chat templates:", error);
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
 * POST /api/companies/[id]/chat-templates
 * Create a new chat template
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    const body = await request.json();
    const { name, content } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Create template
    const template = await prisma.chatTemplate.create({
      data: {
        companyId,
        name: name.trim(),
        content: content.trim(),
        isDefault: false,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating chat template:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Full error:", error);
    return NextResponse.json(
      {
        error: "internal",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

