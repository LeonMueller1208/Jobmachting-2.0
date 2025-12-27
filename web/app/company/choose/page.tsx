"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function CompanyChoose() {
  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Bereich" showBackButton={true} backHref="/" />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl ds-heading mb-4">Unternehmen Bereich</h1>
          <p className="text-base sm:text-lg lg:text-xl ds-body-light">Wählen Sie eine Option aus</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/company/register" className="ds-card ds-card-hover p-8 text-center group">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Neues Unternehmen registrieren</h2>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Registrieren Sie Ihr Unternehmen und erstellen Sie Stellenangebote</p>
          </Link>
          
          <Link href="/company/login" className="ds-card ds-card-hover p-8 text-center group">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl ds-subheading mb-4">Anmelden</h2>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Melden Sie sich mit Ihrem bestehenden Unternehmensprofil an</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
