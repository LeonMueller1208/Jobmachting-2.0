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

        {/* Jobs List - Mobile Optimized */}
        <div className="grid gap-4 sm:gap-6">
          {matchedJobs.map(job => (
            <div key={job.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl ds-subheading mb-2 break-words">{job.title}</h3>
                  <p className="ds-body-light mb-2 text-sm sm:text-base">{job.company.name} • {job.location}</p>
                  <p className="ds-body-light text-sm sm:text-base line-clamp-3">{job.description}</p>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold ds-link-blue mb-1">{job.matchScore}%</div>
                  <div className="text-xs sm:text-sm ds-body-light">Match Score</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="ds-skill-tag-blue text-xs sm:text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm ds-body-light">
                  {job.minExperience} Jahre Erfahrung erforderlich
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleInterest(job.id, "INTERESTED")}
                    className="ds-button-primary-blue text-sm sm:text-base flex-1 sm:flex-initial"
                  >
                    Interesse bekunden
                  </button>
                  <button
                    onClick={() => handleInterest(job.id, "NOT_INTERESTED")}
                    className="ds-button-secondary text-sm sm:text-base flex-1 sm:flex-initial"
                  >
                    Nicht interessiert
                  </button>
                </div>
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
