import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, companyNote } = await request.json();

    // Validate status
    const validStatuses = ["INTERESTED", "NOT_INTERESTED", "COMPANY_REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedInterest = await prisma.interest.update({
      where: { id },
      data: {
        status: status || undefined,
        companyNote: companyNote !== undefined ? companyNote : undefined,
      },
      include: {
        applicant: true,
        job: true,
      },
    });

    return NextResponse.json(updatedInterest);
  } catch (error) {
    console.error("Update interest error:", error);
    return NextResponse.json(
      { error: "Failed to update interest" },
      { status: 500 }
    );
  }
}

