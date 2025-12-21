"use client";

import { useState, useEffect } from "react";

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  description?: string | null;
  website?: string | null;
  companySize?: string | null;
  foundedYear?: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyProfileModal({ isOpen, onClose, companyId }: CompanyProfileModalProps) {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyProfile();
    }
  }, [isOpen, companyId]);

  async function fetchCompanyProfile() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/companies/${companyId}`);
      
      if (!res.ok) {
        throw new Error("Firmenprofil konnte nicht geladen werden");
      }
      
      const data = await res.json();
      setCompany(data);
    } catch (err) {
      console.error("Error fetching company profile:", err);
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="ds-card p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl ds-heading mb-2">
              {loading ? "Lade..." : company?.name || "Firmenprofil"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Company Profile Content */}
        {!loading && !error && company && (
          <>
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="ds-card p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-semibold">Branche</span>
                </div>
                <p className="ds-body">{company.industry}</p>
              </div>

              <div className="ds-card p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold">Standort</span>
                </div>
                <p className="ds-body">{company.location}</p>
              </div>

              {company.companySize && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Unternehmensgröße</span>
                  </div>
                  <p className="ds-body">{company.companySize} Mitarbeiter</p>
                </div>
              )}

              {company.foundedYear && (
                <div className="ds-card p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold">Gründungsjahr</span>
                  </div>
                  <p className="ds-body">{company.foundedYear}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {company.description && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Über das Unternehmen</h3>
                </div>
                <p className="ds-body-light whitespace-pre-wrap">{company.description}</p>
              </div>
            )}

            {/* Website */}
            {company.website && (
              <div className="mb-6">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="font-medium">Website besuchen</span>
                </a>
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 ds-button-secondary"
              >
                Schließen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

