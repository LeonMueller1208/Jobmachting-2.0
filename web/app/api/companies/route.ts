import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      const existing = await prisma.company.findUnique({ where: { email } });
      return NextResponse.json(existing ?? null);
    }
    
    const companies = await prisma.company.findMany({ 
      include: { jobs: true }, 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(companies);
  } catch (e) {
    console.error("GET companies error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, industry, location } = body ?? {};
    
    if (!email || !name || !industry || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    // Check if company already exists
    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Company with this email already exists" }, { status: 409 });
    }
    
    const company = await prisma.company.create({
      data: { email, name, industry, location },
    });
    
    return NextResponse.json(company, { status: 201 });
  } catch (e) {
    console.error("Company creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
