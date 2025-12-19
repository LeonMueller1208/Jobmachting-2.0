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

import { hashPassword, validatePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, skills, location, experience, education, bio, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility } = body ?? {};
    
    if (!email || !name || !Array.isArray(skills) || skills.length === 0 || !location) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    
    // Validate password if provided (required for new accounts)
    if (password !== undefined) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: passwordValidation.error },
          { status: 400 }
        );
      }
    }
    
    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : undefined;
    
    const upserted = await prisma.applicant.upsert({
      where: { email },
      update: { 
        name, 
        skills, 
        location, 
        experience: Number(experience) || 0, 
        education: education || null,
        bio: bio || null, 
        industry: industry || null,
        hierarchy: hierarchy ? Number(hierarchy) : null,
        autonomy: autonomy ? Number(autonomy) : null,
        teamwork: teamwork ? Number(teamwork) : null,
        workStructure: workStructure ? Number(workStructure) : null,
        feedback: feedback ? Number(feedback) : null,
        flexibility: flexibility ? Number(flexibility) : null,
        // Only update passwordHash if password is provided
        ...(passwordHash && { passwordHash })
      },
      create: { 
        email, 
        name,
        passwordHash: passwordHash || null, // Allow null for backward compatibility, but recommend setting password
        skills, 
        location, 
        experience: Number(experience) || 0, 
        education: education || null,
        bio: bio || null, 
        industry: industry || null,
        hierarchy: hierarchy ? Number(hierarchy) : null,
        autonomy: autonomy ? Number(autonomy) : null,
        teamwork: teamwork ? Number(teamwork) : null,
        workStructure: workStructure ? Number(workStructure) : null,
        feedback: feedback ? Number(feedback) : null,
        flexibility: flexibility ? Number(flexibility) : null
      },
    });
    
    // Remove passwordHash from response (security)
    const { passwordHash: _, ...applicantWithoutPassword } = upserted;
    
    return NextResponse.json(applicantWithoutPassword, { status: 201 });
  } catch (e) {
    console.error("Applicant creation error:", e);
    return NextResponse.json({ error: "internal", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
