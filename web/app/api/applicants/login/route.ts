import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";

/**
 * POST /api/applicants/login
 * Authenticates an applicant with email and password
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
    
    // Find applicant by email
    const applicant = await prisma.applicant.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        location: true,
        experience: true,
        education: true,
        bio: true,
        industry: true,
        hierarchy: true,
        autonomy: true,
        teamwork: true,
        workStructure: true,
        feedback: true,
        flexibility: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true, // Include passwordHash for validation
      },
    });
    
    if (!applicant) {
      return NextResponse.json(
        { error: "Ungültige E-Mail oder Passwort" },
        { status: 401 }
      );
    }
    
    // Check if account has password set
    if (!applicant.passwordHash) {
      return NextResponse.json(
        { error: "Dieses Konto hat noch kein Passwort. Bitte setzen Sie ein Passwort über die Registrierung." },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await comparePassword(password, applicant.passwordHash);
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Ungültige E-Mail oder Passwort" },
        { status: 401 }
      );
    }
    
    // Remove passwordHash from response (security)
    const { passwordHash, ...applicantWithoutPassword } = applicant;
    
    return NextResponse.json(applicantWithoutPassword);
  } catch (e) {
    console.error("Applicant login error:", e);
    return NextResponse.json(
      { error: "internal", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

