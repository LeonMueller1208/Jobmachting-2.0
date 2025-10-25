"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ChatModal from "@/components/ChatModal";
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
  requiredEducation?: string | null;
  jobType?: string | null;
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
    education?: string | null;
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
  const [filteredInterests, setFilteredInterests] = useState<Interest[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "interests" | "analytics">("jobs");
  const [analytics, setAnalytics] = useState<any>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    applicantId: string;
    applicantName: string;
    jobId: string;
    jobTitle: string;
  }>({
    isOpen: false,
    applicantId: '',
    applicantName: '',
    jobId: '',
    jobTitle: ''
  });

  useEffect(() => {
    const session = localStorage.getItem("companySession");
    if (session) {
      try {
        const companyData = JSON.parse(session);
        setCompany(companyData);
        fetchAnalytics(companyData.id);
      } catch (error) {
        console.error("Error parsing company session:", error);
        localStorage.removeItem("companySession");
      }
    }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const session = localStorage.getItem("companySession");
      const company = session ? JSON.parse(session) : null;
      
      if (!company || !company.id) {
        setLoading(false);
        return;
      }
      
      const [jobsRes, interestsRes, chatsRes] = await Promise.all([
        fetch(`/api/jobs?companyId=${company.id}`),
        fetch(`/api/interests?companyId=${company.id}`),
        fetch(`/api/chats?userId=${company.id}&userType=company`)
      ]);
      
      const jobsData = await jobsRes.json();
      const interestsData = await interestsRes.json();
      const chatsData = await chatsRes.json();
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setInterests(Array.isArray(interestsData) ? interestsData : []);
      setFilteredInterests(Array.isArray(interestsData) ? interestsData : []);
      setChats(Array.isArray(chatsData) ? chatsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobs([]);
      setInterests([]);
      setFilteredInterests([]);
      setChats([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics(companyId: string) {
    try {
      const response = await fetch(`/api/analytics/company/${companyId}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }

  function filterInterestsByJob(jobId: string | null) {
    setSelectedJobId(jobId);
    if (jobId === null) {
      setFilteredInterests(interests);
    } else {
      const filtered = interests.filter(interest => interest.job.id === jobId);
      setFilteredInterests(filtered);
    }
  }

  // Update filtered interests when interests change
  useEffect(() => {
    if (selectedJobId === null) {
      setFilteredInterests(interests);
    } else {
      const filtered = interests.filter(interest => interest.job.id === selectedJobId);
      setFilteredInterests(filtered);
    }
  }, [interests, selectedJobId]);

  function openChat(interest: Interest) {
    setChatModal({
      isOpen: true,
      applicantId: interest.applicant.id,
      applicantName: interest.applicant.name,
      jobId: interest.job.id,
      jobTitle: interest.job.title
    });
  }

  function closeChat() {
    setChatModal({
      isOpen: false,
      applicantId: '',
      applicantName: '',
      jobId: '',
      jobTitle: ''
    });
  }

  if (loading) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Lade...</div></div>;
  if (!company) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Bitte melden Sie sich an</div></div>;

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Dashboard" showLogout={true} userType="company" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Card - Mobile Optimized */}
        <div className="ds-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2 truncate">Willkommen, {company.name}!</h1>
              <p className="ds-body-light text-sm sm:text-base lg:text-lg">Verwalten Sie Ihre Stellenangebote und Bewerbungen</p>
            </div>
            <Link href="/company/create-job" className="ds-button-primary-green text-sm sm:text-base shrink-0 justify-center sm:justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neue Stelle erstellen
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="ds-card p-2 mb-6 sm:mb-8">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "jobs"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              💼 Meine Stellen
            </button>
            <button
              onClick={() => setActiveTab("interests")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "interests"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              👥 Interessenten
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "analytics"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <>
            {/* Chats Overview */}
            {chats.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Chats</h2>
                <div className="grid gap-4">
                  {chats.map(chat => (
                    <div key={chat.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg ds-subheading mb-1 break-words">
                              Chat mit {chat.applicant.name}
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
                          onClick={() => setChatModal({
                            isOpen: true,
                            applicantId: chat.applicant.id,
                            applicantName: chat.applicant.name,
                            jobId: chat.job.id,
                            jobTitle: chat.job.title
                          })}
                          className="ds-button-primary-blue text-sm sm:text-base flex-1 sm:flex-initial"
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
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Stellenangebote</h2>
              <div className="grid gap-4 sm:gap-5">
                {jobs.map(job => (
                  <div key={job.id} className="ds-card p-5 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-green)]">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 ds-icon-container-green rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl ds-subheading mb-1 break-words">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm ds-body-light">
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
                        <p className="ds-body-light text-sm sm:text-base line-clamp-3 mb-4">{job.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <button
                          onClick={() => filterInterestsByJob(selectedJobId === job.id ? null : job.id)}
                          className={`text-xs sm:text-sm px-3 py-2 transition-all duration-300 ${
                            selectedJobId === job.id 
                              ? 'ds-button-primary-green' 
                              : 'ds-button-secondary'
                          }`}
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {selectedJobId === job.id ? 'Alle anzeigen' : 'Bewerbungen'}
                        </button>
                        <Link 
                          href={`/company/edit-job/${job.id}`}
                          className="ds-button-secondary text-xs sm:text-sm px-3 py-2 justify-center sm:justify-start"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Bearbeiten
                        </Link>
                      </div>
                    </div>
                    
                    {/* Skills Section */}
                    <div className="border-t border-gray-100 pt-4">
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
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Interests Tab */}
        {activeTab === "interests" && (
          <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading">
              Bewerbungen
              <span className="text-sm ds-body-light ml-2">
                ({filteredInterests.length} von {interests.length})
                {selectedJobId && " • gefiltert"}
              </span>
            </h2>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Job Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedJobId || ""}
                  onChange={(e) => filterInterestsByJob(e.target.value || null)}
                  className="ds-input text-xs sm:text-sm appearance-none pr-8"
                >
                  <option value="">Alle Stellen anzeigen</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 ds-body-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Reset Button (only show when filtered) */}
              {selectedJobId && (
                <button
                  onClick={() => filterInterestsByJob(null)}
                  className="ds-button-secondary text-xs sm:text-sm px-3 py-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Zurücksetzen
                </button>
              )}
            </div>
          </div>
          {filteredInterests.length === 0 ? (
            <div className="ds-card p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg ds-subheading mb-2">
                {selectedJobId ? 'Keine Bewerbungen für diese Stelle' : 'Noch keine Bewerbungen'}
              </h3>
              <p className="ds-body-light text-sm sm:text-base">
                {selectedJobId 
                  ? 'Für diese Stelle sind noch keine Bewerbungen eingegangen.' 
                  : 'Bewerber können sich für Ihre Stellenangebote interessieren. Die Bewerbungen erscheinen dann hier.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredInterests.map(interest => (
                <div key={interest.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg ds-subheading mb-2 break-words">{interest.applicant.name}</h3>
                    <p className="ds-body-light mb-2 text-sm sm:text-base">{interest.job.title} • {interest.applicant.location}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm ds-body-light">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {interest.applicant.experience} Jahre Erfahrung
                      </span>
                      {interest.applicant.education && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            {interest.applicant.education}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold ds-link-green mb-1">{interest.matchScore}%</div>
                    <div className="text-xs sm:text-sm ds-body-light">Match Score</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {interest.applicant.skills.map(skill => (
                    <span key={skill} className="ds-skill-tag-default text-xs sm:text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm ds-body-light">
                    Status: {interest.status === "INTERESTED" ? "Interessiert" : "Nicht interessiert"}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => openChat(interest)}
                      className="ds-button-primary-green text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat starten
                    </button>
                    <button className="ds-button-secondary text-sm sm:text-base flex-1 sm:flex-initial">
                      Details anzeigen
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
          </div>
        )}

        {/* Analytics Tab - Job-Centric View */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {!analytics || analytics.jobPerformance.length === 0 ? (
              // No data state
              <div className="ds-card p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl ds-heading mb-2">Noch keine Daten</h3>
                <p className="ds-body-light">Sobald Bewerber Interesse an Ihren Stellen zeigen, sehen Sie hier detaillierte Analytics!</p>
              </div>
            ) : (
              <>
                {/* Overall Summary */}
                <div className="ds-card p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <h2 className="text-xl ds-subheading mb-4">📊 Gesamtübersicht</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold ds-heading text-green-600">{analytics.overview.interestedCount}</div>
                      <div className="ds-body-light text-sm mt-1">Interessierte</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold ds-heading text-purple-600">{analytics.overview.interestRate}%</div>
                      <div className="ds-body-light text-sm mt-1">Interesse-Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold ds-heading text-blue-600">{analytics.overview.activeJobs}</div>
                      <div className="ds-body-light text-sm mt-1">Aktive Stellen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold ds-heading text-orange-600">{analytics.overview.totalInterests}</div>
                      <div className="ds-body-light text-sm mt-1">Gesamt Interaktionen</div>
                    </div>
                  </div>
                </div>

                {/* Job-Specific Analytics Cards */}
                <div>
                  <h2 className="text-xl ds-subheading mb-4">💼 Analytics pro Stelle</h2>
                  <div className="space-y-4">
                    {analytics.jobPerformance.map((job: any) => {
                      const isExpanded = expandedJobId === job.jobId;
                      return (
                        <div key={job.jobId} className="ds-card border-l-4 border-green-500 overflow-hidden transition-all">
                          {/* Compact Job Card */}
                          <div 
                            className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedJobId(isExpanded ? null : job.jobId)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg ds-subheading truncate">{job.jobTitle}</h3>
                                  {job.jobType && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 shrink-0">
                                      💼 {job.jobType}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs ds-body-light mb-3">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                  </span>
                                  {job.industry && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span>{job.industry}</span>
                                    </>
                                  )}
                                </div>
                                
                                {/* Key Metrics Row */}
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="text-lg font-semibold ds-heading">{job.totalInterests}</div>
                                    <div className="text-xs ds-body-light">Gesamt</div>
                                  </div>
                                  <div className="text-center p-2 bg-green-50 rounded">
                                    <div className="text-lg font-semibold ds-heading text-green-600">{job.interested}</div>
                                    <div className="text-xs ds-body-light">Interessiert</div>
                                  </div>
                                  <div className="text-center p-2 bg-red-50 rounded">
                                    <div className="text-lg font-semibold ds-heading text-red-600">{job.notInterested}</div>
                                    <div className="text-xs ds-body-light">Nicht interessiert</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Interest Rate Badge & Expand Icon */}
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="text-center">
                                  <div className="text-3xl font-bold ds-heading text-green-600">{job.interestRate}%</div>
                                  <div className="text-xs ds-body-light whitespace-nowrap">Interesse-Rate</div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                  <svg 
                                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${job.interestRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && job.interested > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-5">
                              <h4 className="text-md ds-subheading mb-3">📊 Detaillierte Bewerber-Insights</h4>
                              
                              {/* Top Skills for THIS job */}
                              {job.insights.topSkills.length > 0 && (
                                <div>
                                  <h5 className="text-sm ds-body font-semibold mb-3 flex items-center gap-2">
                                    <span>🛠️</span> Top Skills der Interessenten
                                  </h5>
                                  <div className="space-y-2">
                                    {(() => {
                                      const maxCount = job.insights.topSkills[0]?.count || 1;
                                      return job.insights.topSkills.map((skill: any) => (
                                        <div key={skill.name} className="flex items-center gap-3">
                                          <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                              <span className="text-sm ds-body capitalize">{skill.name}</span>
                                              <span className="text-xs ds-body-light">{skill.count} Bewerber</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                              <div
                                                className="bg-green-600 h-2 rounded-full transition-all"
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

                              {/* Experience Levels for THIS job */}
                              {(job.insights.experienceLevels.junior > 0 || job.insights.experienceLevels.mid > 0 || job.insights.experienceLevels.senior > 0) && (
                                <div>
                                  <h5 className="text-sm ds-body font-semibold mb-3 flex items-center gap-2">
                                    <span>📈</span> Erfahrungslevel
                                  </h5>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                                      <div className="text-2xl font-bold ds-heading text-blue-600">{job.insights.experienceLevels.junior}</div>
                                      <div className="text-xs ds-body-light mt-1">Junior (0-2 J.)</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-100 rounded-lg">
                                      <div className="text-2xl font-bold ds-heading text-purple-600">{job.insights.experienceLevels.mid}</div>
                                      <div className="text-xs ds-body-light mt-1">Mid (3-5 J.)</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-100 rounded-lg">
                                      <div className="text-2xl font-bold ds-heading text-orange-600">{job.insights.experienceLevels.senior}</div>
                                      <div className="text-xs ds-body-light mt-1">Senior (6+ J.)</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Locations for THIS job */}
                              {job.insights.locations.length > 0 && (
                                <div>
                                  <h5 className="text-sm ds-body font-semibold mb-3 flex items-center gap-2">
                                    <span>📍</span> Standorte der Interessenten
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {job.insights.locations.map((location: any) => (
                                      <div key={location.name} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        <span className="font-medium">{location.name}</span>
                                        <span className="text-xs bg-green-200 px-2 py-0.5 rounded-full">{location.count}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Education Levels for THIS job */}
                              {job.insights.educationLevels.length > 0 && (
                                <div>
                                  <h5 className="text-sm ds-body font-semibold mb-3 flex items-center gap-2">
                                    <span>🎓</span> Bildungsabschlüsse
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {job.insights.educationLevels.map((edu: any) => (
                                      <div key={edu.name} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        <span className="font-medium">{edu.name}</span>
                                        <span className="text-xs bg-blue-200 px-2 py-0.5 rounded-full">{edu.count}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Required Skills Comparison */}
                              {job.requiredSkills && job.requiredSkills.length > 0 && (
                                <div className="pt-4 border-t border-gray-300">
                                  <h5 className="text-sm ds-body font-semibold mb-2 flex items-center gap-2">
                                    <span>✅</span> Erforderliche Skills für diese Stelle
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill: string) => (
                                      <span key={skill} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* No interested applicants message */}
                          {isExpanded && job.interested === 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-5 text-center">
                              <p className="ds-body-light text-sm">Noch keine interessierten Bewerber für diese Stelle.</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={closeChat}
        applicantId={chatModal.applicantId}
        applicantName={chatModal.applicantName}
        companyId={company?.id || ''}
        jobId={chatModal.jobId}
        jobTitle={chatModal.jobTitle}
        userType="company"
        onMessagesRead={fetchData}
      />
    </div>
  );
}
