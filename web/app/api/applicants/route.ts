import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      // Don't return passwordHash for security
      const existing = await prisma.applicant.findUnique({ 
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          skills: true,
          location: true,
          experience: true,
          education: true,
          fieldOfStudy: true,
          fieldOfStudyCategory: true,
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
        }
      });
      return NextResponse.json(existing ?? null);
    }
    
    const applicants = await prisma.applicant.findMany({ 
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
      },
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(applicants);
  } catch (e) {
    console.error("GET applicants error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, skills, location, experience, education, fieldOfStudy, fieldOfStudyCategory, bio, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility } = body ?? {};
    
    if (!name || !Array.isArray(skills) || skills.length === 0 || !location) {
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
      skills, 
      location, 
      experience: Number(experience) || 0, 
      education: education || null,
      fieldOfStudy: fieldOfStudy || null,
      fieldOfStudyCategory: fieldOfStudyCategory || null,
      bio: bio || null, 
      industry: industry || null,
      hierarchy: hierarchy ? Number(hierarchy) : null,
      autonomy: autonomy ? Number(autonomy) : null,
      teamwork: teamwork ? Number(teamwork) : null,
      workStructure: workStructure ? Number(workStructure) : null,
      feedback: feedback ? Number(feedback) : null,
      flexibility: flexibility ? Number(flexibility) : null,
    };
    
    // Add email if provided
    if (email) {
      data.email = email;
    }
    
    // Add passwordHash if provided
    if (passwordHash !== null) {
      data.passwordHash = passwordHash;
    }
    
    // If email is provided, use upsert. Otherwise, create new account.
    let applicant;
    if (email) {
      applicant = await prisma.applicant.upsert({
        where: { email },
        update: data,
        create: data,
      });
    } else {
      // Create new account without email (email will be set later when user interacts)
      applicant = await prisma.applicant.create({
        data,
      });
    }
    
    // Remove passwordHash from response (security)
    const { passwordHash: _, ...applicantWithoutPassword } = applicant;
    
    return NextResponse.json(applicantWithoutPassword, { status: 201 });
  } catch (e) {
    console.error("Applicant creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
