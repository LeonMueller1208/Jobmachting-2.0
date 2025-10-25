import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;

    // Fetch all jobs for this company
    const jobs = await prisma.job.findMany({
      where: { companyId },
      include: {
        interests: {
          include: {
            applicant: true
          }
        }
      }
    });

    if (jobs.length === 0) {
      return NextResponse.json({
        overview: {
          totalInterests: 0,
          interestedCount: 0,
          notInterestedCount: 0,
          interestRate: 0,
          averageMatchScore: 0,
          totalJobs: 0
        },
        jobPerformance: [],
        applicantInsights: {
          topSkills: [],
          locations: [],
          experienceLevels: { junior: 0, mid: 0, senior: 0 },
          educationLevels: []
        }
      });
    }

    // Collect all interests across all jobs
    const allInterests = jobs.flatMap(job => job.interests);
    const interestedApplicants = allInterests.filter(i => i.status === "INTERESTED");
    const notInterestedApplicants = allInterests.filter(i => i.status === "NOT_INTERESTED");

    // Helper function to count occurrences
    const countOccurrences = (items: string[]): { [key: string]: number } => {
      return items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
    };

    // Sort by count
    const sortByCount = (obj: { [key: string]: number }) => 
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

    // Analyze interested applicants
    const interestedApplicantData = interestedApplicants.map(i => i.applicant);
    
    // Top skills from interested applicants
    const allSkills = interestedApplicantData.flatMap(a => a.skills as string[]);
    const skillCounts = countOccurrences(allSkills);

    // Locations
    const locations = interestedApplicantData.map(a => a.location);
    const locationCounts = countOccurrences(locations);

    // Experience levels
    const experienceLevels = {
      junior: interestedApplicantData.filter(a => a.experience >= 0 && a.experience <= 2).length,
      mid: interestedApplicantData.filter(a => a.experience >= 3 && a.experience <= 5).length,
      senior: interestedApplicantData.filter(a => a.experience > 5).length
    };

    // Education levels
    const educations = interestedApplicantData
      .map(a => a.education)
      .filter(Boolean) as string[];
    const educationCounts = countOccurrences(educations);

    // Job performance analysis with detailed insights per job
    const jobPerformance = jobs.map(job => {
      const jobInterests = job.interests;
      const interestedInJob = jobInterests.filter(i => i.status === "INTERESTED");
      const notInterestedInJob = jobInterests.filter(i => i.status === "NOT_INTERESTED");
      const total = interestedInJob.length + notInterestedInJob.length;

      // Get applicants who are interested in THIS job
      const interestedApplicantsForJob = interestedInJob.map(i => i.applicant);

      // Skills from interested applicants for THIS job
      const jobSkills = interestedApplicantsForJob.flatMap(a => a.skills as string[]);
      const jobSkillCounts = countOccurrences(jobSkills);

      // Locations from interested applicants for THIS job
      const jobLocations = interestedApplicantsForJob.map(a => a.location);
      const jobLocationCounts = countOccurrences(jobLocations);

      // Experience levels for THIS job
      const jobExperienceLevels = {
        junior: interestedApplicantsForJob.filter(a => a.experience >= 0 && a.experience <= 2).length,
        mid: interestedApplicantsForJob.filter(a => a.experience >= 3 && a.experience <= 5).length,
        senior: interestedApplicantsForJob.filter(a => a.experience > 5).length
      };

      // Education levels for THIS job
      const jobEducations = interestedApplicantsForJob
        .map(a => a.education)
        .filter(Boolean) as string[];
      const jobEducationCounts = countOccurrences(jobEducations);

      return {
        jobId: job.id,
        jobTitle: job.title,
        location: job.location,
        jobType: job.jobType,
        industry: job.industry,
        totalInterests: total,
        interested: interestedInJob.length,
        notInterested: notInterestedInJob.length,
        interestRate: total > 0 ? Math.round((interestedInJob.length / total) * 100) : 0,
        requiredSkills: job.requiredSkills as string[],
        minExperience: job.minExperience,
        requiredEducation: job.requiredEducation,
        // Detailed insights for THIS job
        insights: {
          topSkills: sortByCount(jobSkillCounts).slice(0, 8),
          locations: sortByCount(jobLocationCounts),
          experienceLevels: jobExperienceLevels,
          educationLevels: sortByCount(jobEducationCounts)
        }
      };
    }).sort((a, b) => b.interested - a.interested); // Sort by most interested

    // Overall statistics
    const overview = {
      totalInterests: allInterests.length,
      interestedCount: interestedApplicants.length,
      notInterestedCount: notInterestedApplicants.length,
      interestRate: allInterests.length > 0 
        ? Math.round((interestedApplicants.length / allInterests.length) * 100) 
        : 0,
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.interests.length > 0).length
    };

    const response = {
      overview,
      jobPerformance,
      applicantInsights: {
        topSkills: sortByCount(skillCounts).slice(0, 10),
        locations: sortByCount(locationCounts),
        experienceLevels,
        educationLevels: sortByCount(educationCounts)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Company analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company analytics" }, 
      { status: 500 }
    );
  }
}

