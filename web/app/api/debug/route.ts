import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [applicants, companies, jobs, interests, chats, messages] = await Promise.all([
      prisma.applicant.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.interest.count(),
      prisma.chat.count(),
      prisma.message.count(),
    ]);

    return NextResponse.json({
      database: "connected",
      counts: {
        applicants,
        companies,
        jobs,
        interests,
        chats,
        messages
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({
      database: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

