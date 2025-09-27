"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function CompanyChoose() {

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Bereich" showBackButton={true} backHref="/" />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Startseite
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Stellen anbieten</h1>
          <p className="text-lg text-gray-600">Als Unternehmen Talente finden</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/company/login" className="group rounded-xl border-2 border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Anmelden</h2>
              <p className="text-gray-600">Bereits registriert? Mit E-Mail anmelden</p>
            </div>
          </Link>
          
          <Link href="/company/register" className="group rounded-xl border-2 border-gray-200 p-8 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registrieren</h2>
              <p className="text-gray-600">Neues Firmenkonto erstellen</p>
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}

