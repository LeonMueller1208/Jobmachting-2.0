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
  const [filteredInterests, setFilteredInterests] = useState<Interest[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

        {/* Chats Overview */}
        {chats.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Chats</h2>
            <div className="grid gap-4">
              {chats.map(chat => (
                <div key={chat.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg ds-subheading mb-1 break-words">
                        Chat mit {chat.applicant.name}
                      </h3>
                      <p className="ds-body-light text-sm sm:text-base">{chat.job.title}</p>
                      {chat.messages && chat.messages.length > 0 && (
                        <p className="ds-body-light text-xs sm:text-sm mt-1">
                          Letzte Nachricht: {new Date(chat.messages[0].createdAt).toLocaleDateString('de-DE')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openChat({ applicant: chat.applicant, job: chat.job })}
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

        {/* Interests List - Filtered */}
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
                    <p className="ds-body-light text-sm sm:text-base">{interest.applicant.experience} Jahre Erfahrung</p>
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
      </main>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={closeChat}
        applicantId={chatModal.applicantId}
        companyId={company.id}
        jobId={chatModal.jobId}
        applicantName={chatModal.applicantName}
        jobTitle={chatModal.jobTitle}
        userType="company"
      />
    </div>
  );
}
