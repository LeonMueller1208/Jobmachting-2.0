"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { computeMatchingScore } from "@/lib/matching";

type Company = { 
  id: string; 
  name: string; 
  email: string; 
  industry: string; 
  location: string 
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

type Interest = { 
  id: string; 
  applicant: { 
    id: string; 
    name: string; 
    skills: string[]; 
    experience: number; 
    location: string; 
    bio?: string | null; 
    industry?: string | null 
  }; 
  job: { 
    id: string; 
    title: string; 
    industry?: string | null 
  }; 
  status: "INTERESTED" | "NOT_INTERESTED"; 
  matchScore: number; 
  passes: boolean 
};

export default function CompanyDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("companySession");
    if (session) {
      setCompany(JSON.parse(session));
    }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const session = localStorage.getItem("companySession");
      const company = session ? JSON.parse(session) : null;
      
      const [jobsRes, interestsRes] = await Promise.all([
        fetch(company ? `/api/jobs?companyId=${company.id}` : "/api/jobs"),
        fetch(company ? `/api/interests?companyId=${company.id}` : "/api/interests")
      ]);
      
      const jobsData = await jobsRes.json();
      const interestsData = await interestsRes.json();
      
      setJobs(jobsData);
      setInterests(interestsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Lade...</div></div>;
  if (!company) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Bitte melden Sie sich an</div></div>;

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Dashboard" showLogout={true} userType="company" />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="ds-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl ds-heading mb-2">Willkommen, {company.name}!</h1>
              <p className="ds-body-light">Verwalten Sie Ihre Stellenangebote und Bewerbungen</p>
            </div>
            <Link href="/company/create-job" className="ds-button-primary-green">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neue Stelle erstellen
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        <div className="mb-8">
          <h2 className="text-xl ds-subheading mb-4">Ihre Stellenangebote</h2>
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job.id} className="ds-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg ds-subheading mb-2">{job.title}</h3>
                    <p className="ds-body-light mb-2">{job.location} • {job.minExperience} Jahre Erfahrung</p>
                    <p className="ds-body-light text-sm">{job.description}</p>
                  </div>
                  <Link 
                    href={`/company/edit-job/${job.id}`}
                    className="ds-button-secondary text-sm px-3 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Bearbeiten
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="ds-skill-tag-green">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests List */}
        <div>
          <h2 className="text-xl ds-subheading mb-4">Bewerbungen</h2>
          {interests.length === 0 ? (
            <div className="ds-card p-8 text-center">
              <div className="w-16 h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg ds-subheading mb-2">Noch keine Bewerbungen</h3>
              <p className="ds-body-light">Bewerber können sich für Ihre Stellenangebote interessieren. Die Bewerbungen erscheinen dann hier.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {interests.map(interest => (
                <div key={interest.id} className="ds-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg ds-subheading mb-2">{interest.applicant.name}</h3>
                    <p className="ds-body-light mb-2">{interest.job.title} • {interest.applicant.location}</p>
                    <p className="ds-body-light text-sm">{interest.applicant.experience} Jahre Erfahrung</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold ds-link-green mb-1">{interest.matchScore}%</div>
                    <div className="text-sm ds-body-light">Match Score</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {interest.applicant.skills.map(skill => (
                    <span key={skill} className="ds-skill-tag-default">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm ds-body-light">
                    Status: {interest.status === "INTERESTED" ? "Interessiert" : "Nicht interessiert"}
                  </div>
                  <div className="flex gap-2">
                    <button className="ds-button-primary-green">
                      Kontaktieren
                    </button>
                    <button className="ds-button-secondary">
                      Details anzeigen
                    </button>
                  </div>
                </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
