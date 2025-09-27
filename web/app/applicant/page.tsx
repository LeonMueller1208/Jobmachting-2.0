"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { computeMatchingScore } from "@/lib/matching";

type Applicant = { 
  id: string; 
  name: string; 
  email: string; 
  skills: string[]; 
  location: string; 
  experience: number; 
  bio?: string | null; 
  industry?: string | null 
};

type Job = { 
  id: string; 
  title: string; 
  description: string; 
  requiredSkills: string[]; 
  location: string; 
  minExperience: number; 
  industry?: string | null; 
  company: { id: string; name: string; location: string } 
};

export default function ApplicantDashboard() {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("applicantSession");
    if (session) {
      setApplicant(JSON.parse(session));
    }
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleInterest(jobId: string, status: "INTERESTED" | "NOT_INTERESTED") {
    if (!applicant) return;
    
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: applicant.id, jobId, status }),
      });
      
      if (res.ok) {
        alert(status === "INTERESTED" ? "Interesse bekundet!" : "Interesse zurückgezogen!");
      }
    } catch (error) {
      console.error("Error updating interest:", error);
    }
  }

  const matchedJobs = jobs.map(job => {
    if (!applicant) return { ...job, matchScore: 0 };
    
    const score = computeMatchingScore({
      applicant: { 
        skills: applicant.skills, 
        experience: applicant.experience, 
        location: applicant.location,
        bio: applicant.bio || undefined,
        industry: applicant.industry || undefined
      },
      job: { 
        requiredSkills: job.requiredSkills, 
        minExperience: job.minExperience, 
        location: job.location,
        title: job.title,
        description: job.description,
        industry: job.industry || undefined
      },
    });
    
    return { ...job, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);

  if (loading) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Lade...</div></div>;
  if (!applicant) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Bitte melden Sie sich an</div></div>;

  return (
    <div className="ds-background min-h-screen">
      <Header title="Bewerber Dashboard" />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="ds-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl ds-heading mb-2">Willkommen, {applicant.name}!</h1>
              <p className="ds-body-light">Hier sind Ihre passenden Stellenangebote</p>
            </div>
            <Link 
              href="/applicant/edit"
              className="ds-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Profil bearbeiten
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6">
          {matchedJobs.map(job => (
            <div key={job.id} className="ds-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl ds-subheading mb-2">{job.title}</h3>
                  <p className="ds-body-light mb-2">{job.company.name} • {job.location}</p>
                  <p className="ds-body-light text-sm">{job.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold ds-link-blue mb-1">{job.matchScore}%</div>
                  <div className="text-sm ds-body-light">Match Score</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="ds-skill-tag-blue">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm ds-body-light">
                  {job.minExperience} Jahre Erfahrung erforderlich
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInterest(job.id, "INTERESTED")}
                    className="ds-button-primary-blue"
                  >
                    Interesse bekunden
                  </button>
                  <button
                    onClick={() => handleInterest(job.id, "NOT_INTERESTED")}
                    className="ds-button-secondary"
                  >
                    Nicht interessiert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
