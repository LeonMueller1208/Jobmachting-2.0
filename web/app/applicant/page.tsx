"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ApplicantChatModal from "@/components/ApplicantChatModal";
import { computeMatchingScore } from "@/lib/matching";

type Applicant = { 
  id: string; 
  name: string; 
  email: string; 
  skills: string[]; 
  location: string; 
  experience: number; 
  education?: string | null;
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
  requiredEducation?: string | null;
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
  const [chats, setChats] = useState<any[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>("all"); // New: location filter state
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    chatId: string;
    companyName: string;
    jobTitle: string;
  }>({
    isOpen: false,
    chatId: '',
    companyName: '',
    jobTitle: ''
  });

  useEffect(() => {
    const session = localStorage.getItem("applicantSession");
    if (session) {
      const applicantData = JSON.parse(session);
      setApplicant(applicantData);
      fetchChats(applicantData.id);
    }
    fetchJobs();
  }, []);

  async function fetchChats(applicantId: string) {
    try {
      const response = await fetch(`/api/chats?userId=${applicantId}&userType=applicant`);
      if (response.ok) {
        const chatsData = await response.json();
        setChats(Array.isArray(chatsData) ? chatsData : []);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  }

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      
      // Safety check: ensure data is an array
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("Jobs API returned non-array:", data);
        setJobs([]); // Set empty array instead of error object
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }

  async function handleInterest(jobId: string, status: "INTERESTED" | "NOT_INTERESTED") {
    if (!applicant) {
      setErrorMessage("Bitte melden Sie sich an");
      setShowError(true);
      return;
    }
    
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
        const errorData = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        setErrorMessage(errorData.error || errorData.details || "Fehler beim Aktualisieren des Interesses");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error updating interest:", error);
      setErrorMessage(error instanceof Error ? error.message : "Netzwerkfehler beim Aktualisieren des Interesses");
      setShowError(true);
    }
  }

  // Get all unique locations from jobs
  const availableLocations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean))).sort();

  // Filter jobs by location first
  const filteredJobs = jobs.filter(job => {
    if (locationFilter === "all") return true;
    if (locationFilter === "my-location") return job.location === applicant?.location;
    return job.location === locationFilter;
  });

  const matchedJobs = filteredJobs.map(job => {
    if (!applicant) return { ...job, matchScore: 0 };
    
    // Safety checks for data integrity
    const applicantSkills = Array.isArray(applicant.skills) ? applicant.skills : [];
    const jobSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
    
    const score = computeMatchingScore({
      applicant: { 
        skills: applicantSkills, 
        experience: applicant.experience || 0, 
        location: applicant.location || "",
        education: applicant.education || undefined,
        bio: applicant.bio || undefined,
        industry: applicant.industry || undefined
      },
      job: { 
        requiredSkills: jobSkills, 
        minExperience: job.minExperience || 0, 
        location: job.location || "",
        requiredEducation: job.requiredEducation || undefined,
        title: job.title || "",
        description: job.description || "",
        industry: job.industry || undefined
      },
    });
    
    return { ...job, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20); // Show only top 20 matches

  function openChat(chat: any) {
    setChatModal({
      isOpen: true,
      chatId: chat.id,
      companyName: chat.company.name,
      jobTitle: chat.job.title
    });
  }

  function closeChat() {
    setChatModal({
      isOpen: false,
      chatId: '',
      companyName: '',
      jobTitle: ''
    });
  }

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2 truncate">Willkommen, {applicant.name}!</h1>
              <p className="ds-body-light text-sm sm:text-base lg:text-lg">Hier sind Ihre passenden Stellenangebote</p>
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

        {/* Location Filter */}
        <div className="ds-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="ds-label mb-0 shrink-0">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Standort filtern:
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="ds-input ds-input-focus-blue flex-1 sm:max-w-md"
            >
              <option value="all">Alle Standorte ({jobs.length} Jobs)</option>
              {applicant?.location && (
                <option value="my-location">
                  Mein Standort: {applicant.location} ({jobs.filter(j => j.location === applicant.location).length} Jobs)
                </option>
              )}
              {availableLocations.map(location => (
                <option key={location} value={location}>
                  {location} ({jobs.filter(j => j.location === location).length} Jobs)
                </option>
              ))}
            </select>
            {locationFilter !== "all" && (
              <button
                onClick={() => setLocationFilter("all")}
                className="ds-button-secondary text-sm sm:text-base shrink-0"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        </div>

        {/* Chats Section */}
        {chats.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Chats</h2>
            <div className="grid gap-4">
              {chats.map(chat => (
                <div key={chat.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-green)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg ds-subheading mb-1 break-words">
                          Chat mit {chat.company.name}
                        </h3>
                        {chat._count && chat._count.messages > 0 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg">
                            {chat._count.messages}
                          </span>
                        )}
                      </div>
                      <p className="ds-body-light text-sm sm:text-base">{chat.job.title}</p>
                      {chat.messages && chat.messages.length > 0 && (
                        <p className="ds-body-light text-xs sm:text-sm mt-1">
                          Letzte Nachricht: {new Date(chat.messages[0].createdAt).toLocaleDateString('de-DE')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openChat(chat)}
                      className="ds-button-primary-green text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat öffnen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs List - Enhanced Design */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading">
            Passende Stellen
          </h2>
          <span className="ds-body-light text-sm sm:text-base">
            {matchedJobs.length} {matchedJobs.length === 1 ? 'Stelle' : 'Stellen'} gefunden
            {matchedJobs.length === 20 && filteredJobs.length > 20 && (
              <span className="text-xs ml-2">(Top 20 angezeigt)</span>
            )}
          </span>
        </div>
        <div className="grid gap-4 sm:gap-5">
          {matchedJobs.map(job => (
            <div key={job.id} className="ds-card p-5 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)]">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 ds-icon-container-blue rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                        {job.requiredEducation && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                              </svg>
                              {job.requiredEducation}
                            </span>
                          </>
                        )}
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleInterest(job.id, "INTERESTED")}
                  className="ds-button-primary-blue text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 inline-flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Interesse bekunden</span>
                </button>
                <button
                  onClick={() => handleInterest(job.id, "NOT_INTERESTED")}
                  className="ds-button-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 inline-flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Nicht interessiert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="ds-card p-4 sm:p-6 flex items-center gap-3 shadow-2xl border-l-4 border-[var(--accent-blue)] max-w-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 ds-icon-container-blue rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="ds-subheading text-sm sm:text-base mb-1">Erfolgreich!</p>
              <p className="ds-body-light text-xs sm:text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-6 sm:p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl ds-heading mb-2">Fehler</h2>
            <p className="ds-body-light text-sm sm:text-base mb-6">{errorMessage}</p>
            <button 
              onClick={() => setShowError(false)}
              className="ds-button-primary-blue px-6 py-2.5"
            >
              OK, verstanden
            </button>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      <ApplicantChatModal
        isOpen={chatModal.isOpen}
        onClose={closeChat}
        chatId={chatModal.chatId}
        companyName={chatModal.companyName}
        jobTitle={chatModal.jobTitle}
        applicantId={applicant.id}
        onMessagesRead={() => fetchChats(applicant.id)}
      />
    </div>
  );
}
