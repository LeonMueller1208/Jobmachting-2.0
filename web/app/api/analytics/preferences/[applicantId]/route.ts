import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicantId: string }> }
) {
  try {
    const { applicantId } = await params;

    // Fetch all interests for this applicant with job details
    const interests = await prisma.interest.findMany({
      where: { applicantId },
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (interests.length === 0) {
      return NextResponse.json({
        totalInteractions: 0,
        interestedCount: 0,
        notInterestedCount: 0,
        interestRate: 0,
        preferences: {
          skills: [],
          jobTypes: [],
          locations: [],
          industries: [],
          educationLevels: []
        },
        disliked: {
          skills: [],
          jobTypes: [],
          locations: [],
          industries: []
        }
      });
    }

    // Separate interested vs not interested
    const interested = interests.filter(i => i.status === "INTERESTED");
    const notInterested = interests.filter(i => i.status === "NOT_INTERESTED");

    // Helper function to count occurrences
    const countOccurrences = (items: string[]): { [key: string]: number } => {
      return items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
    };

    // Analyze liked features
    const likedSkills = interested.flatMap(i => i.job.requiredSkills as string[]);
    const likedJobTypes = interested.map(i => i.job.jobType).filter(Boolean) as string[];
    const likedLocations = interested.map(i => i.job.location);
    const likedIndustries = interested.map(i => i.job.industry).filter(Boolean) as string[];
    const likedEducation = interested.map(i => i.job.requiredEducation).filter(Boolean) as string[];

    // Analyze disliked features
    const dislikedSkills = notInterested.flatMap(i => i.job.requiredSkills as string[]);
    const dislikedJobTypes = notInterested.map(i => i.job.jobType).filter(Boolean) as string[];
    const dislikedLocations = notInterested.map(i => i.job.location);
    const dislikedIndustries = notInterested.map(i => i.job.industry).filter(Boolean) as string[];

    // Count and sort by frequency
    const skillCounts = countOccurrences(likedSkills);
    const jobTypeCounts = countOccurrences(likedJobTypes);
    const locationCounts = countOccurrences(likedLocations);
    const industryCounts = countOccurrences(likedIndustries);
    const educationCounts = countOccurrences(likedEducation);

    const dislikedSkillCounts = countOccurrences(dislikedSkills);
    const dislikedJobTypeCounts = countOccurrences(dislikedJobTypes);
    const dislikedLocationCounts = countOccurrences(dislikedLocations);
    const dislikedIndustryCounts = countOccurrences(dislikedIndustries);

    // Convert to sorted arrays
    const sortByCount = (obj: { [key: string]: number }) => 
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

    const response = {
      totalInteractions: interests.length,
      interestedCount: interested.length,
      notInterestedCount: notInterested.length,
      interestRate: interests.length > 0 
        ? Math.round((interested.length / interests.length) * 100) 
        : 0,
      
      preferences: {
        skills: sortByCount(skillCounts).slice(0, 10), // Top 10
        jobTypes: sortByCount(jobTypeCounts),
        locations: sortByCount(locationCounts),
        industries: sortByCount(industryCounts),
        educationLevels: sortByCount(educationCounts)
      },
      
      disliked: {
        skills: sortByCount(dislikedSkillCounts).slice(0, 10),
        jobTypes: sortByCount(dislikedJobTypeCounts),
        locations: sortByCount(dislikedLocationCounts),
        industries: sortByCount(dislikedIndustryCounts)
      },

      recentActivity: interests.slice(0, 5).map(i => ({
        jobTitle: i.job.title,
        company: i.job.company.name,
        status: i.status,
        date: i.createdAt
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Preferences analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" }, 
      { status: 500 }
    );
  }
}

