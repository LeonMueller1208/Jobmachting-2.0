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
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        const message = status === "INTERESTED" ? "Interesse erfolgreich bekundet!" : "Interesse zurückgezogen!";
        setSuccessMessage(message);
        setShowSuccess(true);
        
        // Modal nach 3 Sekunden automatisch schließen
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Fehler beim Aktualisieren des Interesses");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error updating interest:", error);
      setErrorMessage("Netzwerkfehler beim Aktualisieren des Interesses");
      setShowError(true);
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
      <Header title="Bewerber Dashboard" showLogout={true} userType="applicant" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Card - Mobile Optimized */}
        <div className="ds-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl ds-heading mb-2 truncate">Willkommen, {applicant.name}!</h1>
              <p className="ds-body-light text-sm sm:text-base">Hier sind Ihre passenden Stellenangebote</p>
            </div>
            <Link 
              href="/applicant/edit"
              className="ds-button-secondary text-sm sm:text-base shrink-0 justify-center sm:justify-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Profil bearbeiten
            </Link>
          </div>
        </div>

        {/* Jobs List - Enhanced Design */}
        <div className="grid gap-4 sm:gap-5">
          {matchedJobs.map(job => (
            <div key={job.id} className="ds-card p-5 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)]">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 ds-icon-container-blue rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 112 2v6a2 2 0 11-2 2V6z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl ds-subheading mb-1 break-words">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm ds-body-light">
                        <span className="flex items-center gap-1 font-medium text-[var(--accent-blue)]">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.company.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.minExperience} Jahre Erfahrung
                        </span>
                        {job.industry && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span>{job.industry}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="ds-body-light text-sm sm:text-base line-clamp-3 mb-4">{job.description}</p>
                </div>
                
                {/* Match Score */}
                <div className="text-center sm:text-right shrink-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-dark)] text-white shadow-lg">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold leading-none">{job.matchScore}%</div>
                      <div className="text-xs opacity-90">Match</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 ds-body-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium ds-body-light">Erforderliche Skills:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="ds-skill-tag-default text-xs sm:text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleInterest(job.id, "INTERESTED")}
                  className="ds-button-primary-blue text-sm sm:text-base flex-1 sm:flex-initial"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Interesse bekunden
                </button>
                <button
                  onClick={() => handleInterest(job.id, "NOT_INTERESTED")}
                  className="ds-button-secondary text-sm sm:text-base flex-1 sm:flex-initial"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Nicht interessiert
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 ds-icon-container-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Erfolgreich!</h2>
            <p className="ds-body-light mb-6">{successMessage}</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="ds-button-primary-blue"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Fehler</h2>
            <p className="ds-body-light mb-6">{errorMessage}</p>
            <button 
              onClick={() => setShowError(false)}
              className="ds-button-primary-blue"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
