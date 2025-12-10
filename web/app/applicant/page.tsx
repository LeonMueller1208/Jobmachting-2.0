"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ApplicantChatModal from "@/components/ApplicantChatModal";
import { computeMatchingScore, computePreferenceBoost, applyPreferenceBoost, computeCulturalFit, type UserPreferences } from "@/lib/matching";

type Applicant = { 
  id: string; 
  name: string; 
  email: string; 
  skills: string[]; 
  location: string; 
  experience: number; 
  education?: string | null;
  bio?: string | null; 
  industry?: string | null;
  workValues?: string[] | any;
  teamStyle?: string | null;
  workEnvironment?: string | null;
  motivation?: string | null;
};

type Job = { 
  id: string; 
  title: string; 
  description: string; 
  requiredSkills: string[]; 
  location: string; 
  minExperience: number; 
  requiredEducation?: string | null;
  jobType?: string | null;
  industry?: string | null; 
  workValues?: string[] | any;
  teamStyle?: string | null;
  workEnvironment?: string | null;
  motivation?: string | null;
  company: { id: string; name: string; location: string };
  matchScore?: number;
  culturalFit?: number | null;
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
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"jobs" | "preferences" | "chats">("jobs");
  const [preferences, setPreferences] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
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
  const [jobDetailsModal, setJobDetailsModal] = useState<{
    isOpen: boolean;
    job: Job | null;
  }>({
    isOpen: false,
    job: null
  });

  useEffect(() => {
    const session = localStorage.getItem("applicantSession");
    if (session) {
      const applicantData = JSON.parse(session);
      setApplicant(applicantData);
      fetchChats(applicantData.id);
      fetchPreferences(applicantData.id);
      
      // Check if welcome modal should be shown (only after registration)
      const welcomeStatus = localStorage.getItem("applicant_welcome_shown");
      if (welcomeStatus === "pending") {
        setShowWelcomeModal(true);
      }
    }
    fetchJobs();
  }, []);
  
  function handleCloseWelcome() {
    localStorage.setItem("applicant_welcome_shown", "true");
    setShowWelcomeModal(false);
  }

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

  async function fetchPreferences(applicantId: string) {
    try {
      const response = await fetch(`/api/analytics/preferences/${applicantId}`);
      if (response.ok) {
        const preferencesData = await response.json();
        setPreferences(preferencesData);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
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

  // Get all unique locations and job types from jobs
  const availableLocations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean))).sort();
  const availableJobTypes = Array.from(new Set(jobs.map(job => job.jobType).filter((type): type is string => Boolean(type)))).sort();

  // Filter jobs by location AND job type
  const filteredJobs = jobs.filter(job => {
    // Location filter
    if (locationFilter !== "all") {
      if (locationFilter === "my-location" && job.location !== applicant?.location) return false;
      if (locationFilter !== "my-location" && job.location !== locationFilter) return false;
    }
    
    // Job type filter
    if (jobTypeFilter !== "all" && job.jobType !== jobTypeFilter) return false;
    
    return true;
  });

  const matchedJobs = filteredJobs.map(job => {
    if (!applicant) return { ...job, matchScore: 0 };
    
    // Safety checks for data integrity
    const applicantSkills = Array.isArray(applicant.skills) ? applicant.skills : [];
    const jobSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
    
    // Calculate base matching score
    const baseScore = computeMatchingScore({
      applicant: { 
        skills: applicantSkills, 
        experience: applicant.experience || 0, 
        location: applicant.location || "",
        education: applicant.education || undefined,
        bio: applicant.bio || undefined,
        industry: applicant.industry || undefined,
        workValues: applicant.workValues,
        teamStyle: applicant.teamStyle || undefined,
        workEnvironment: applicant.workEnvironment || undefined,
        motivation: applicant.motivation || undefined
      },
      job: { 
        requiredSkills: jobSkills, 
        minExperience: job.minExperience || 0, 
        location: job.location || "",
        requiredEducation: job.requiredEducation || undefined,
        title: job.title || "",
        description: job.description || "",
        industry: job.industry || undefined,
        workValues: job.workValues,
        teamStyle: job.teamStyle || undefined,
        workEnvironment: job.workEnvironment || undefined,
        motivation: job.motivation || undefined
      },
    });
    
    // Calculate cultural fit score
    const culturalFitScore = computeCulturalFit({
      applicant: {
        skills: applicantSkills,
        experience: applicant.experience || 0,
        location: applicant.location || "",
        education: applicant.education || undefined,
        bio: applicant.bio || undefined,
        industry: applicant.industry || undefined,
        workValues: applicant.workValues,
        teamStyle: applicant.teamStyle || undefined,
        workEnvironment: applicant.workEnvironment || undefined,
        motivation: applicant.motivation || undefined
      },
      job: {
        requiredSkills: jobSkills,
        minExperience: job.minExperience || 0,
        location: job.location || "",
        requiredEducation: job.requiredEducation || undefined,
        title: job.title || "",
        description: job.description || "",
        industry: job.industry || undefined,
        workValues: job.workValues,
        teamStyle: job.teamStyle || undefined,
        workEnvironment: job.workEnvironment || undefined,
        motivation: job.motivation || undefined
      }
    });
    
    // Apply preference boost if preferences are available
    let finalScore = baseScore;
    if (preferences && preferences.preferences) {
      const userPrefs: UserPreferences = {
        skills: preferences.preferences.skills || [],
        industries: preferences.preferences.industries || [],
        educationLevels: preferences.preferences.educationLevels || []
      };
      
      const boostFactor = computePreferenceBoost(
        {
          requiredSkills: jobSkills,
          industry: job.industry || undefined,
          requiredEducation: job.requiredEducation || undefined
        },
        userPrefs
      );
      
      finalScore = applyPreferenceBoost(baseScore, boostFactor);
    }
    
    return { ...job, matchScore: finalScore, culturalFit: culturalFitScore };
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full overflow-x-hidden">
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

        {/* Tab Navigation */}
        <div className="ds-card p-2 mb-6 sm:mb-8 overflow-hidden">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base whitespace-nowrap min-w-0 ${
                activeTab === "jobs"
                  ? "bg-[var(--accent-blue)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">💼 Stellenangebote</span>
              <span className="sm:hidden">💼 Stellen</span>
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all relative text-xs sm:text-base whitespace-nowrap min-w-0 ${
                activeTab === "chats"
                  ? "bg-[var(--accent-blue)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              💬 Chats
              {chats.length > 0 && chats.some((chat: any) => chat._count && chat._count.messages > 0) && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chats.reduce((sum: number, chat: any) => sum + (chat._count?.messages || 0), 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base whitespace-nowrap min-w-0 ${
                activeTab === "preferences"
                  ? "bg-[var(--accent-blue)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">📊 Meine Präferenzen</span>
              <span className="sm:hidden">📊 Präferenzen</span>
            </button>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <>
        {/* Filters */}
        <div className="ds-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div>
              <label className="ds-label mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Standort filtern:
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="ds-input ds-input-focus-blue w-full"
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
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="ds-label mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Job-Art filtern:
              </label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="ds-input ds-input-focus-blue w-full"
              >
                <option value="all">Alle Job-Arten ({jobs.length} Jobs)</option>
                {availableJobTypes.map(type => (
                  <option key={type} value={type}>
                    {type} ({jobs.filter(j => j.jobType === type).length} Jobs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          {(locationFilter !== "all" || jobTypeFilter !== "all") && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setLocationFilter("all");
                  setJobTypeFilter("all");
                }}
                className="ds-button-secondary text-sm sm:text-base"
              >
                Alle Filter zurücksetzen
              </button>
            </div>
          )}
        </div>

        {/* Jobs List - Enhanced Design */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading">
            Passende Stellen
          </h2>
          <span className="ds-body-light text-xs sm:text-sm sm:text-base">
            {matchedJobs.length < filteredJobs.length ? (
              <>
                Top {matchedJobs.length} von {filteredJobs.length} {filteredJobs.length === 1 ? 'Stelle' : 'Stellen'} angezeigt
              </>
            ) : (
              <>
                {matchedJobs.length} {matchedJobs.length === 1 ? 'Stelle' : 'Stellen'} gefunden
              </>
            )}
          </span>
        </div>

        {/* Info Box: Top 20 Matches */}
        {matchedJobs.length < filteredJobs.length && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Wir zeigen dir die <strong>Top {matchedJobs.length} passendsten Stellen</strong> von insgesamt <strong>{filteredJobs.length} Stellen</strong>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Die Stellen sind nach Match-Score sortiert – die besten Matches zuerst! 🎯
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:gap-5">
          {matchedJobs.map(job => (
            <div key={job.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)] overflow-hidden">
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
                        {job.jobType && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              💼 {job.jobType}
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
                  <p className="ds-body-light text-sm sm:text-base line-clamp-3 mb-3">{job.description}</p>
                  
                  {/* Match Scores - Horizontal on Mobile */}
                  <div className="flex gap-2 sm:hidden">
                    {/* Skills Match Score */}
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 border-2 border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-dark)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {Math.round(job.matchScore)}%
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-700">Skills</div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cultural Fit Score */}
                    {job.culturalFit !== null && job.culturalFit !== undefined && (
                      <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2.5 border-2 border-purple-200">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {Math.round(job.culturalFit)}%
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-700">Kultur</div>
                            <div className="text-xs text-gray-500">Fit</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Match Scores - Vertical on Desktop */}
                <div className="hidden sm:flex sm:flex-col gap-2 shrink-0">
                  {/* Skills Match Score */}
                  <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-dark)] text-white shadow-lg">
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold leading-none">{Math.round(job.matchScore)}%</div>
                      <div className="text-xs lg:text-sm opacity-90 mt-0.5">Match</div>
                    </div>
                  </div>
                  
                  {/* Cultural Fit Score */}
                  {job.culturalFit !== null && job.culturalFit !== undefined && (
                    <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold leading-none">{Math.round(job.culturalFit)}%</div>
                        <div className="text-xs lg:text-sm opacity-90 mt-0.5">Kultur</div>
                      </div>
                    </div>
                  )}
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

              {/* Details Button - Subtle but Clear */}
              <div className="mb-4">
                <button
                  onClick={() => setJobDetailsModal({ isOpen: true, job })}
                  className="w-full bg-white hover:bg-blue-50 text-blue-600 font-medium py-2.5 px-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Vollständige Details anzeigen</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleInterest(job.id, "INTERESTED")}
                  className="ds-button-primary-blue text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 inline-flex items-center justify-center flex-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Interesse bekunden</span>
                </button>
                <button
                  onClick={() => handleInterest(job.id, "NOT_INTERESTED")}
                  className="ds-button-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 inline-flex items-center justify-center flex-1"
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

        {/* Info Box: Top 20 Matches (Bottom) */}
        {matchedJobs.length < filteredJobs.length && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Du siehst die <strong>Top {matchedJobs.length} passendsten Stellen</strong> von insgesamt <strong>{filteredJobs.length} Stellen</strong>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Die Stellen sind nach Match-Score sortiert – die besten Matches zuerst! 🎯
                </p>
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div className="space-y-6">
            {chats.length === 0 ? (
              <div className="ds-card p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl ds-heading mb-2">Noch keine Chats</h3>
                <p className="ds-body-light">
                  Sobald Sie Interesse an einer Stelle bekunden und das Unternehmen antwortet, erscheinen Ihre Chats hier.
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            {!preferences || preferences.totalInteractions === 0 ? (
              <div className="ds-card p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl ds-heading mb-2">Noch keine Daten</h3>
                <p className="ds-body-light">
                  Beginne damit, Jobs zu bewerten, um deine Präferenzen zu sehen!
                </p>
              </div>
            ) : (
              <>
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="ds-card p-6 text-center border-l-4 border-blue-500">
                    <div className="text-3xl font-bold ds-heading text-blue-600">{preferences.totalInteractions}</div>
                    <div className="ds-body-light text-sm mt-1">Bewertete Jobs</div>
                  </div>
                  <div className="ds-card p-6 text-center border-l-4 border-green-500">
                    <div className="text-3xl font-bold ds-heading text-green-600">{preferences.interestedCount}</div>
                    <div className="ds-body-light text-sm mt-1">Interessiert</div>
                  </div>
                  <div className="ds-card p-6 text-center border-l-4 border-purple-500">
                    <div className="text-3xl font-bold ds-heading text-purple-600">{preferences.interestRate}%</div>
                    <div className="ds-body-light text-sm mt-1">Interesse-Rate</div>
                  </div>
                </div>

                {/* Preferred Skills */}
                {preferences.preferences.skills.length > 0 && (
                  <div className="ds-card p-6">
                    <h3 className="text-lg ds-subheading mb-4 flex items-center gap-2">
                      <span>🛠️</span> Bevorzugte Skills
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        const topSkills = preferences.preferences.skills.slice(0, 5);
                        const maxCount = topSkills[0]?.count || 1; // Höchster Wert = 100%
                        return topSkills.map((skill: any) => (
                          <div key={skill.name} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="ds-body font-medium">{skill.name}</span>
                                <span className="ds-body-light text-sm">{skill.count}x gemocht</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                                  style={{ width: `${(skill.count / maxCount) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Preferred Job Types */}
                {preferences.preferences.jobTypes.length > 0 && (
                  <div className="ds-card p-6">
                    <h3 className="text-lg ds-subheading mb-4 flex items-center gap-2">
                      <span>💼</span> Bevorzugte Job-Arten
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {preferences.preferences.jobTypes.map((type: any) => (
                        <div key={type.name} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
                          <span className="font-medium">{type.name}</span>
                          <span className="text-sm bg-purple-200 px-2 py-0.5 rounded-full">{type.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Locations */}
                {preferences.preferences.locations.length > 0 && (
                  <div className="ds-card p-6">
                    <h3 className="text-lg ds-subheading mb-4 flex items-center gap-2">
                      <span>📍</span> Bevorzugte Standorte
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {preferences.preferences.locations.map((location: any) => (
                        <div key={location.name} className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                          <span className="font-medium">{location.name}</span>
                          <span className="text-sm bg-green-200 px-2 py-0.5 rounded-full">{location.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Industries */}
                {preferences.preferences.industries.length > 0 && (
                  <div className="ds-card p-6">
                    <h3 className="text-lg ds-subheading mb-4 flex items-center gap-2">
                      <span>🏢</span> Bevorzugte Branchen
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {preferences.preferences.industries.map((industry: any) => (
                        <div key={industry.name} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full">
                          <span className="font-medium">{industry.name}</span>
                          <span className="text-sm bg-orange-200 px-2 py-0.5 rounded-full">{industry.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {preferences.recentActivity && preferences.recentActivity.length > 0 && (
                  <div className="ds-card p-6">
                    <h3 className="text-lg ds-subheading mb-4 flex items-center gap-2">
                      <span>📅</span> Letzte Aktivität
                    </h3>
                    <div className="space-y-3">
                      {preferences.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="ds-body font-medium">{activity.jobTitle}</div>
                            <div className="ds-body-light text-sm">{activity.company}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              activity.status === "INTERESTED" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {activity.status === "INTERESTED" ? "✓ Interessiert" : "✗ Nicht interessiert"}
                            </span>
                            <span className="ds-body-light text-xs">
                              {new Date(activity.date).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
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

      {/* Job Details Modal */}
      {jobDetailsModal.isOpen && jobDetailsModal.job && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="ds-card p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl ds-heading mb-2">{jobDetailsModal.job.title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm ds-body-light">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {jobDetailsModal.job.company.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {jobDetailsModal.job.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setJobDetailsModal({ isOpen: false, job: null })}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Match Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Skills Match Score */}
              {jobDetailsModal.job.matchScore !== undefined && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">🎯 Skills Match</span>
                    <span className="text-3xl font-bold text-blue-600">{Math.round(jobDetailsModal.job.matchScore)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${jobDetailsModal.job.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Cultural Fit Score */}
              {jobDetailsModal.job.culturalFit !== null && jobDetailsModal.job.culturalFit !== undefined && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">🤝 Cultural Fit</span>
                    <span className="text-3xl font-bold text-purple-600">{Math.round(jobDetailsModal.job.culturalFit)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${jobDetailsModal.job.culturalFit}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="ds-card p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">Erforderliche Erfahrung</span>
                </div>
                <p className="ds-body">{jobDetailsModal.job.minExperience} {jobDetailsModal.job.minExperience === 1 ? 'Jahr' : 'Jahre'}</p>
              </div>

              {jobDetailsModal.job.requiredEducation && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span className="text-sm font-semibold">Erforderlicher Abschluss</span>
                  </div>
                  <p className="ds-body">{jobDetailsModal.job.requiredEducation}</p>
                </div>
              )}

              {jobDetailsModal.job.jobType && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Job-Art</span>
                  </div>
                  <p className="ds-body">{jobDetailsModal.job.jobType}</p>
                </div>
              )}

              {jobDetailsModal.job.industry && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-semibold">Branche</span>
                  </div>
                  <p className="ds-body">{jobDetailsModal.job.industry}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold">Stellenbeschreibung</h3>
              </div>
              <p className="ds-body-light whitespace-pre-wrap">{jobDetailsModal.job.description}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold">Erforderliche Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobDetailsModal.job.requiredSkills.map((skill: string) => (
                  <span key={skill} className="ds-skill-tag-blue">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleInterest(jobDetailsModal.job!.id, "INTERESTED");
                  setJobDetailsModal({ isOpen: false, job: null });
                }}
                className="flex-1 ds-button-primary-blue"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Interesse bekunden
              </button>
              <button
                onClick={() => {
                  handleInterest(jobDetailsModal.job!.id, "NOT_INTERESTED");
                  setJobDetailsModal({ isOpen: false, job: null });
                }}
                className="flex-1 ds-button-secondary"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Nicht interessiert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="ds-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 ds-icon-container-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl ds-heading mb-2">🎉 Willkommen bei JobMatching!</h2>
              <p className="ds-body-light text-sm sm:text-base">Lass uns dir zeigen, wie du die perfekte Stelle findest</p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">📋 Entdecke deine Top-Matches</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Sieh dir Jobs an, die zu deinem Profil passen. Der Match-Score zeigt dir, wie gut du zur Stelle passt.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">🎯 Nutze die Filter</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Filtere nach Standort und Job-Art, um genau das zu finden, was du suchst.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">💙 Bekunde Interesse</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Ein Klick auf "Interesse bekunden" - und das Unternehmen sieht dein Profil und kann dich kontaktieren!
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">💬 Chatte mit Unternehmen</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Sobald ein Unternehmen Interesse hat, kannst du direkt per Chat kommunizieren.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">📊 Tracke deine Präferenzen</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Im Tab "Meine Präferenzen" siehst du, welche Jobs und Skills du bevorzugst - wie Spotify Wrapped für deine Jobsuche!
                  </p>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">💡 Pro-Tipp</h4>
                  <p className="text-xs sm:text-sm text-blue-800">
                    Je mehr Jobs du bewertest (interessiert/nicht interessiert), desto besser lernt die Plattform deine Präferenzen kennen und kann dir bessere Matches vorschlagen!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCloseWelcome}
              className="w-full ds-button-primary-blue text-base sm:text-lg py-3"
            >
              Alles klar, verstanden! 🚀
            </button>
            
            <button
              onClick={handleCloseWelcome}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
