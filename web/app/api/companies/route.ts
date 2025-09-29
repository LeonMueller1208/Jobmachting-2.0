import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    console.log("GET companies API called with email:", email); // Debug log
    
    if (email) {
      console.log("Searching for company with email:", email); // Debug log
      const existing = await prisma.company.findUnique({ where: { email } });
      console.log("Found company:", existing); // Debug log
      return NextResponse.json(existing ?? null);
    }
    
    const companies = await prisma.company.findMany({ 
      include: { jobs: true }, 
      orderBy: { createdAt: "desc" } 
    });
    console.log("Found all companies:", companies.length); // Debug log
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
    
    const upserted = await prisma.company.upsert({
      where: { email },
      update: { name, industry, location },
      create: { email, name, industry, location },
    });
    
    return NextResponse.json(upserted, { status: 201 });
  } catch (e) {
    console.error("Company creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
