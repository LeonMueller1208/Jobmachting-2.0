import { NextResponse } from "next/server";

// Temporary in-memory storage for demo purposes
let companies: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      const existing = companies.find(c => c.email === email);
      return NextResponse.json(existing ?? null);
    }
    
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
    const existingIndex = companies.findIndex(c => c.email === email);
    
    const companyData = {
      id: existingIndex >= 0 ? companies[existingIndex].id : `company_${Date.now()}`,
      email,
      name,
      industry,
      location,
      createdAt: existingIndex >= 0 ? companies[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing
      companies[existingIndex] = companyData;
    } else {
      // Create new
      companies.push(companyData);
    }
    
    return NextResponse.json(companyData, { status: 201 });
  } catch (e) {
    console.error("Company creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
