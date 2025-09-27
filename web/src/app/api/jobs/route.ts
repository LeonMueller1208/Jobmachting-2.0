import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const where = companyId ? { companyId: String(companyId) } : {};
  const jobs = await prisma.job.findMany({ where, include: { company: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, requiredSkills, location, minExperience, companyId, industry } = body ?? {};
  const created = await prisma.job.create({
    data: { title, description, requiredSkills, location, minExperience, companyId, industry: industry || null },
  });
  return NextResponse.json(created, { status: 201 });
}
