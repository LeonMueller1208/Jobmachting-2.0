"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ChatModal from "@/components/ChatModal";
import { computeMatchingScore } from "@/lib/matching";
import { formatLastMessageTime, formatChatStartDate } from "@/lib/dateUtils";

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
  status: "INTERESTED" | "NOT_INTERESTED" | "COMPANY_REJECTED"; 
  matchScore: number; 
  passes: boolean;
  companyNote?: string | null;
  updatedAt?: string;
};

export default function CompanyDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [filteredInterests, setFilteredInterests] = useState<Interest[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "interests" | "analytics" | "chats">("jobs");
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
  const [applicantDetailsModal, setApplicantDetailsModal] = useState<{
    isOpen: boolean;
    applicant: Interest['applicant'] | null;
    job: Interest['job'] | null;
    matchScore: number;
  }>({
    isOpen: false,
    applicant: null,
    job: null,
    matchScore: 0
  });
  const [interestFilter, setInterestFilter] = useState<"active" | "archived">("active");
  const [chatFilter, setChatFilter] = useState<"active" | "archived">("active");
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    interestId: string;
    applicantName: string;
  }>({
    isOpen: false,
    interestId: '',
    applicantName: ''
  });
  const [rejectNote, setRejectNote] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("companySession");
    if (session) {
      try {
        const companyData = JSON.parse(session);
        setCompany(companyData);
        fetchAnalytics(companyData.id);
        
        // Check if welcome modal should be shown (only after registration)
        const welcomeStatus = localStorage.getItem("company_welcome_shown");
        if (welcomeStatus === "pending") {
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error("Error parsing company session:", error);
        localStorage.removeItem("companySession");
      }
    }
    fetchData();
  }, []);
  
  function handleCloseWelcome() {
    localStorage.setItem("company_welcome_shown", "true");
    setShowWelcomeModal(false);
  }

  async function fetchData() {
    try {
      const session = localStorage.getItem("companySession");
      const company = session ? JSON.parse(session) : null;
      
      if (!company || !company.id) {
        setLoading(false);
        return;
      }
      
      const [jobsRes, interestsRes] = await Promise.all([
        fetch(`/api/jobs?companyId=${company.id}`),
        fetch(`/api/interests?companyId=${company.id}`)
      ]);
      
      const jobsData = await jobsRes.json();
      const interestsData = await interestsRes.json();
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setInterests(Array.isArray(interestsData) ? interestsData : []);
      setFilteredInterests(Array.isArray(interestsData) ? interestsData : []);
      
      // Fetch chats separately with filter
      fetchChats(company.id);
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

  async function fetchChats(companyId: string) {
    try {
      const response = await fetch(`/api/chats?userId=${companyId}&userType=company&filter=${chatFilter}`);
      if (response.ok) {
        const chatsData = await response.json();
        setChats(Array.isArray(chatsData) ? chatsData : []);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  }

  async function archiveChat(chatId: string, archived: boolean) {
    try {
      const response = await fetch(`/api/chats/${chatId}/archive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: 'company', archived })
      });
      
      if (response.ok) {
        // Refresh chats list
        if (company?.id) {
          fetchChats(company.id);
        }
      }
    } catch (error) {
      console.error('Error archiving chat:', error);
      alert('Fehler beim Archivieren des Chats');
    }
  }

  function filterInterestsByJob(jobId: string | null) {
    setSelectedJobId(jobId);
    applyFilters(jobId, interestFilter);
  }

  function applyFilters(jobId: string | null, statusFilter: "active" | "archived") {
    let filtered = interests;

    // Filter by status (active/archived)
    if (statusFilter === "active") {
      filtered = filtered.filter(interest => interest.status === "INTERESTED");
    } else {
      filtered = filtered.filter(interest => interest.status === "COMPANY_REJECTED");
    }

    // Filter by job (if selected)
    if (jobId !== null) {
      filtered = filtered.filter(interest => interest.job.id === jobId);
    }

    setFilteredInterests(filtered);
  }

  // Update filtered interests when interests or filters change
  useEffect(() => {
    applyFilters(selectedJobId, interestFilter);
  }, [interests, selectedJobId, interestFilter]);

  // Fetch chats when filter changes
  useEffect(() => {
    if (company?.id) {
      fetchChats(company.id);
    }
  }, [company?.id, chatFilter]);

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

  async function handleRejectApplicant() {
    if (!rejectModal.interestId) return;

    try {
      const res = await fetch(`/api/interests/${rejectModal.interestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPANY_REJECTED",
          companyNote: rejectNote || null
        }),
      });

      if (res.ok) {
        // Refresh interests
        await fetchData();
        // Close modal and reset
        setRejectModal({ isOpen: false, interestId: '', applicantName: '' });
        setRejectNote('');
      } else {
        alert("Fehler beim Ablehnen des Bewerbers");
      }
    } catch (error) {
      console.error("Reject applicant error:", error);
      alert("Fehler beim Ablehnen des Bewerbers");
    }
  }

  async function handleReactivateApplicant(interestId: string) {
    try {
      const res = await fetch(`/api/interests/${interestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "INTERESTED"
        }),
      });

      if (res.ok) {
        await fetchData();
      } else {
        alert("Fehler beim Reaktivieren des Bewerbers");
      }
    } catch (error) {
      console.error("Reactivate applicant error:", error);
      alert("Fehler beim Reaktivieren des Bewerbers");
    }
  }


  if (loading) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Lade...</div></div>;
  if (!company) return <div className="ds-background min-h-screen flex items-center justify-center"><div className="text-lg">Bitte melden Sie sich an</div></div>;

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Dashboard" showLogout={true} userType="company" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full overflow-x-hidden">
        {/* Welcome Card - Mobile Optimized */}
        <div className="ds-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2 truncate">Willkommen, {company.name}!</h1>
              <p className="ds-body-light text-sm sm:text-base lg:text-lg">Verwalten Sie Ihre Stellenangebote und Bewerbungen</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/company/create-job" className="ds-button-primary-green text-sm sm:text-base whitespace-nowrap">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="truncate">Neue Stelle erstellen</span>
              </Link>
              <Link href="/company/edit" className="px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold rounded-[var(--border-radius-button)] border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="truncate">Profil bearbeiten</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="ds-card p-2 mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                activeTab === "jobs"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">💼 Meine Stellen</span>
              <span className="sm:hidden">💼 Stellen</span>
            </button>
            <button
              onClick={() => setActiveTab("interests")}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                activeTab === "interests"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">👥 Interessenten</span>
              <span className="sm:hidden">👥 Bewerber</span>
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base relative ${
                activeTab === "chats"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">💬 Chats</span>
              <span className="sm:hidden">💬</span>
              {chats.length > 0 && chats.some((chat: any) => chat._count && chat._count.messages > 0) && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chats.reduce((sum: number, chat: any) => sum + (chat._count?.messages || 0), 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                activeTab === "analytics"
                  ? "bg-[var(--accent-green)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">📊 Analytics</span>
              <span className="sm:hidden">📊 Stats</span>
            </button>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <>
            {/* Jobs List - Enhanced Design */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Stellenangebote</h2>
              <div className="grid gap-4 sm:gap-5">
                {jobs.map(job => (
                  <div key={job.id} className="ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-green)] overflow-hidden">
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
          {/* Filter Tabs: Active / Archived */}
          <div className="ds-card p-2 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInterestFilter("active")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  interestFilter === "active"
                    ? "bg-[var(--accent-green)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                👥 Aktive Bewerber ({interests.filter(i => i.status === "INTERESTED").length})
              </button>
              <button
                onClick={() => setInterestFilter("archived")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  interestFilter === "archived"
                    ? "bg-[var(--accent-green)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📦 Archivierte Bewerber ({interests.filter(i => i.status === "COMPANY_REJECTED").length})
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading">
              {interestFilter === "active" ? "Aktive Bewerbungen" : "Archivierte Bewerbungen"}
              <span className="text-sm ds-body-light ml-2">
                ({filteredInterests.length} {selectedJobId && " • gefiltert"})
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
                
                {/* Company Note (if archived) */}
                {interest.status === "COMPANY_REJECTED" && interest.companyNote && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Ihre Notiz:</div>
                    <div className="text-sm text-gray-700">{interest.companyNote}</div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm ds-body-light">
                    Status: {interest.status === "INTERESTED" ? "Interessiert" : interest.status === "COMPANY_REJECTED" ? "Archiviert" : "Nicht interessiert"}
                    {interest.status === "COMPANY_REJECTED" && interest.updatedAt && (
                      <span className="ml-2">• {new Date(interest.updatedAt).toLocaleDateString('de-DE')}</span>
                    )}
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
                    <button 
                      onClick={() => setApplicantDetailsModal({ isOpen: true, applicant: interest.applicant, job: interest.job, matchScore: interest.matchScore })}
                      className="ds-button-secondary text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Details
                    </button>
                    
                    {/* Conditional buttons based on status */}
                    {interest.status === "INTERESTED" ? (
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, interestId: interest.id, applicantName: interest.applicant.name })}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 sm:flex-initial inline-flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Ablehnen
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReactivateApplicant(interest.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 sm:flex-initial inline-flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reaktivieren
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
          </div>
        )}

        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div className="space-y-6">
            {chats.length === 0 ? (
              <div className="ds-card p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl ds-heading mb-2">Noch keine Chats</h3>
                <p className="ds-body-light">
                  Sobald Bewerber Interesse an Ihren Stellen zeigen und Sie antworten, erscheinen Ihre Chats hier.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Ihre Chats</h2>
                  
                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-4 border-b-2 border-gray-200">
                    <button
                      onClick={() => setChatFilter("active")}
                      className={`px-4 py-2 font-semibold text-sm sm:text-base transition-colors ${
                        chatFilter === "active"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Aktive Chats
                    </button>
                    <button
                      onClick={() => setChatFilter("archived")}
                      className={`px-4 py-2 font-semibold text-sm sm:text-base transition-colors ${
                        chatFilter === "archived"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Archivierte Chats
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {chats.map(chat => (
                      <div key={chat.id} className={`ds-card p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--accent-blue)] ${chatFilter === "archived" ? "opacity-75" : ""}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg ds-subheading mb-1 break-words">
                                Chat mit {chat.applicant.name}
                              </h3>
                              {chat._count && chat._count.messages > 0 && chatFilter === "active" && (
                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg">
                                  {chat._count.messages}
                                </span>
                              )}
                            </div>
                            <p className="ds-body-light text-sm sm:text-base">{chat.job.title}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              {chat.messages && chat.messages.length > 0 ? (
                                <p className="ds-body-light text-xs sm:text-sm">
                                  Letzte Nachricht: {formatLastMessageTime(chat.messages[0].createdAt)}
                                </p>
                              ) : (
                                <p className="ds-body-light text-xs sm:text-sm">
                                  Chat gestartet: {formatChatStartDate(chat.createdAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {chatFilter === "active" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveChat(chat.id, true);
                                }}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Chat archivieren"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                              </button>
                            )}
                            {chatFilter === "archived" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveChat(chat.id, false);
                                }}
                                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chat wiederherstellen"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            )}
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
                      </div>
                    ))}
                  </div>
                </div>
              </>
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
                          <div className="p-5">
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
                              
                              {/* Interest Rate Badge */}
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="text-center">
                                  <div className="text-3xl font-bold ds-heading text-green-600">{job.interestRate}%</div>
                                  <div className="text-xs ds-body-light whitespace-nowrap">Interesse-Rate</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3 mb-4">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${job.interestRate}%` }}
                              ></div>
                            </div>

                            {/* Modern "Details anzeigen" Button */}
                            {!isExpanded && (
                              <button
                                onClick={() => setExpandedJobId(job.jobId)}
                                className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span>Details anzeigen</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Expanded Details with Slide Animation */}
                          {isExpanded && job.interested > 0 && (
                            <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-5 space-y-5 animate-slideDown">
                              {/* Close Button - Sticky at top */}
                              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                                <h4 className="text-md ds-subheading flex items-center gap-2">
                                  <span className="text-2xl">📊</span>
                                  <span>Detaillierte Bewerber-Insights</span>
                                </h4>
                                <button
                                  onClick={() => setExpandedJobId(null)}
                                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span className="hidden sm:inline">Details schließen</span>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              </div>
                              
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

      {/* Applicant Details Modal */}
      {applicantDetailsModal.isOpen && applicantDetailsModal.applicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="ds-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl ds-heading mb-2">{applicantDetailsModal.applicant.name}</h2>
                <p className="ds-body-light">Bewerberdetails für: {applicantDetailsModal.job?.title}</p>
              </div>
              <button
                onClick={() => setApplicantDetailsModal({ isOpen: false, applicant: null, job: null, matchScore: 0 })}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Match Score */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm ds-body-light">Match Score</span>
                <span className="text-3xl font-bold text-green-600">{Math.round(applicantDetailsModal.matchScore)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${applicantDetailsModal.matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="ds-card p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold">Standort</span>
                </div>
                <p className="ds-body">{applicantDetailsModal.applicant.location}</p>
              </div>

              <div className="ds-card p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">Berufserfahrung</span>
                </div>
                <p className="ds-body">{applicantDetailsModal.applicant.experience} {applicantDetailsModal.applicant.experience === 1 ? 'Jahr' : 'Jahre'}</p>
              </div>

              {applicantDetailsModal.applicant.education && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span className="text-sm font-semibold">Abschluss</span>
                  </div>
                  <p className="ds-body">{applicantDetailsModal.applicant.education}</p>
                </div>
              )}

              {applicantDetailsModal.applicant.industry && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-semibold">Bevorzugte Branche</span>
                  </div>
                  <p className="ds-body">{applicantDetailsModal.applicant.industry}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {applicantDetailsModal.applicant.skills.map((skill: string) => (
                  <span key={skill} className="ds-skill-tag-blue">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            {applicantDetailsModal.applicant.bio && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Über mich</h3>
                </div>
                <p className="ds-body-light">{applicantDetailsModal.applicant.bio}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const interest = filteredInterests.find(i => i.applicant.id === applicantDetailsModal.applicant?.id);
                  if (interest) {
                    openChat(interest);
                    setApplicantDetailsModal({ isOpen: false, applicant: null, job: null, matchScore: 0 });
                  }
                }}
                className="flex-1 ds-button-primary-green"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat starten
              </button>
              <button
                onClick={() => setApplicantDetailsModal({ isOpen: false, applicant: null, job: null, matchScore: 0 })}
                className="flex-1 ds-button-secondary"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="ds-card p-6 sm:p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl ds-heading">Bewerber ablehnen?</h2>
              <button
                onClick={() => {
                  setRejectModal({ isOpen: false, interestId: '', applicantName: '' });
                  setRejectNote('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="ds-body mb-4">
              <strong>{rejectModal.applicantName}</strong> wird archiviert. Sie können ihn später jederzeit reaktivieren.
            </p>

            <div className="mb-6">
              <label className="ds-label">Optionale Notiz für interne Zwecke:</label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="ds-input ds-input-focus-green"
                rows={4}
                placeholder='z.B. "Überqualifiziert" oder "Passt nicht zur Teamgröße"...'
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal({ isOpen: false, interestId: '', applicantName: '' });
                  setRejectNote('');
                }}
                className="flex-1 ds-button-secondary"
              >
                Abbrechen
              </button>
              <button
                onClick={handleRejectApplicant}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300"
              >
                Ablehnen & Archivieren
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
              <div className="w-16 h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl ds-heading mb-2">🏢 Willkommen im Firmen-Dashboard!</h2>
              <p className="ds-body-light text-sm sm:text-base">So finden Sie die perfekten Kandidaten für Ihr Team</p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">📝 Erstellen Sie Stellenanzeigen</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Klicken Sie auf "Neue Stelle erstellen" und beschreiben Sie Ihre offene Position mit allen relevanten Details.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">👥 Empfangen Sie qualifizierte Bewerber</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Unser Matching-Algorithmus zeigt Ihre Stelle passenden Bewerbern. Im Tab "Interessenten" sehen Sie, wer sich interessiert.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">🎯 Nutzen Sie den Match-Score</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Jeder Bewerber hat einen Match-Score (0-100%), der zeigt, wie gut er zur Stelle passt - basierend auf Skills, Erfahrung und Ausbildung.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">💬 Kontaktieren Sie Kandidaten</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Nutzen Sie den integrierten Chat, um direkt mit interessierten Bewerbern zu kommunizieren und Interviews zu vereinbaren.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">📊 Nutzen Sie Analytics</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Im Analytics-Tab sehen Sie detaillierte Statistiken zu Ihren Jobs: Interessenten-Anzahl, Top-Skills, beliebte Standorte und mehr!
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">📦 Archivieren Sie Bewerber</h3>
                  <p className="text-xs sm:text-sm ds-body-light">
                    Mit "Ablehnen" können Sie Bewerber archivieren (mit optionaler Notiz). Sie bleiben unsichtbar für den Bewerber und können jederzeit reaktiviert werden.
                  </p>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1 text-sm sm:text-base">💡 Pro-Tipp</h4>
                  <p className="text-xs sm:text-sm text-green-800">
                    Je detaillierter Sie Ihre Stellenbeschreibung ausfüllen (Skills, Erfahrung, Ausbildung), desto besser funktioniert das Matching und desto qualifiziertere Bewerber erhalten Sie!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCloseWelcome}
              className="w-full ds-button-primary-green text-base sm:text-lg py-3"
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
