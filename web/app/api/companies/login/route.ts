import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";

/**
 * POST /api/companies/login
 * Authenticates a company with email and password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }
    
    // Find company by email
    const company = await prisma.company.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true, // Include passwordHash for validation
      },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Ungültige E-Mail oder Passwort" },
        { status: 401 }
      );
    }
    
    // Check if account has password set
    if (!company.passwordHash) {
      return NextResponse.json(
        { error: "Dieses Konto hat noch kein Passwort. Bitte setzen Sie ein Passwort über die Registrierung." },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await comparePassword(password, company.passwordHash);
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Ungültige E-Mail oder Passwort" },
        { status: 401 }
      );
    }
    
    // Remove passwordHash from response (security)
    const { passwordHash, ...companyWithoutPassword } = company;
    
    return NextResponse.json(companyWithoutPassword);
  } catch (e) {
    console.error("Company login error:", e);
    return NextResponse.json(
      { error: "internal", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

