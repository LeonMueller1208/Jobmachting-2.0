"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function ApplicantChoose() {
  return (
    <div className="ds-background min-h-screen">
      <Header title="Bewerber Bereich" showBackButton={true} backHref="/" />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl ds-heading mb-4">Bewerber Bereich</h1>
          <p className="text-lg ds-body-light">Wählen Sie eine Option aus</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/applicant/register" className="ds-card ds-card-hover p-8 text-center group">
            <div className="w-16 h-16 ds-icon-container-blue rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl ds-subheading mb-4">Neues Profil erstellen</h2>
            <p className="ds-body-light">Erstellen Sie ein neues Bewerberprofil und finden Sie passende Stellen</p>
          </Link>
          
          <Link href="/applicant/login" className="ds-card ds-card-hover p-8 text-center group">
            <div className="w-16 h-16 ds-icon-container-blue rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-xl ds-subheading mb-4">Anmelden</h2>
            <p className="ds-body-light">Melden Sie sich mit Ihrem bestehenden Profil an</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
