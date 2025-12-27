import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      // Don't return passwordHash for security
      const existing = await prisma.company.findUnique({ 
        where: { email },
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
        }
      });
      return NextResponse.json(existing ?? null);
    }
    
    const companies = await prisma.company.findMany({ 
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
        jobs: {
          select: {
            id: true,
            title: true,
            description: true,
            requiredSkills: true,
            location: true,
            minExperience: true,
            requiredEducation: true,
            jobType: true,
            industry: true,
            hierarchy: true,
            autonomy: true,
            teamwork: true,
            workStructure: true,
            feedback: true,
            flexibility: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(companies);
  } catch (e) {
    console.error("GET companies error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

import { hashPassword, validatePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, industry, location, description, website, companySize, foundedYear } = body ?? {};
    
    if (!name || !industry || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    // Validate password if provided
    if (password !== undefined && password !== null && password !== "") {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: passwordValidation.error },
          { status: 400 }
        );
      }
    }
    
    // Check if company already exists (only if email is provided)
    if (email) {
      const existing = await prisma.company.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Company with this email already exists" }, { status: 409 });
      }
    }
    
    // Hash password if provided
    let passwordHash: string | null = null;
    if (password) {
      try {
        passwordHash = await hashPassword(password);
      } catch (error) {
        console.error("Password hashing error:", error);
        return NextResponse.json(
          { error: "Fehler beim Verschlüsseln des Passworts" },
          { status: 500 }
        );
      }
    }
    
    // Build create/update data
    const data: any = { 
      name, 
      industry, 
      location,
    };
    
    // Add email if provided
    if (email) {
      data.email = email;
    }
    
    // Add optional fields if provided
    if (description !== undefined) data.description = description;
    if (website !== undefined) data.website = website;
    if (companySize !== undefined) data.companySize = companySize;
    if (foundedYear !== undefined) data.foundedYear = foundedYear;
    
    // Add passwordHash if provided
    if (passwordHash !== null) {
      data.passwordHash = passwordHash;
    }
    
    // If email is provided, use upsert. Otherwise, create new account.
    let company;
    if (email) {
      company = await prisma.company.upsert({
        where: { email },
        update: data,
        create: data,
      });
    } else {
      // Create new account without email (email will be set later when user interacts)
      company = await prisma.company.create({
        data,
      });
    }
    
    // Remove passwordHash from response (security)
    const { passwordHash: _, ...companyWithoutPassword } = company;
    
    return NextResponse.json(companyWithoutPassword, { status: 201 });
  } catch (e) {
    console.error("Company creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
