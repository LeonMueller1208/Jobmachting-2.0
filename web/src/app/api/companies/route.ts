import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (email) {
    const existing = await prisma.company.findUnique({ where: { email } });
    return NextResponse.json(existing ?? null);
  }
  const companies = await prisma.company.findMany({ include: { jobs: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, industry, location } = body ?? {};
    if (!email || !name || !industry || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    const upserted = await prisma.company.upsert({
      where: { email },
      update: { name, industry, location },
      create: { email, name, industry, location },
    });
    return NextResponse.json(upserted, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

