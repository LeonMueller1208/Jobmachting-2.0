"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="ds-background min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading tracking-tight mb-3">
            Intelligente Jobvermittlung
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-light ds-body max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
            Intelligente Jobvermittlung mit KI-gestütztem Matching. 
            Finde den perfekten Job oder den idealen Kandidaten.
          </p>
          {/* Subtle Divider */}
          <div className="w-16 sm:w-20 h-px bg-gray-300 mx-auto mt-4 sm:mt-6"></div>
        </div>
        
        {/* Cards Section - Mobile Optimized */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mt-8 sm:mt-12 lg:mt-14 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Job Seeker Card */}
          <Link 
            href="/applicant/choose" 
            className="group relative ds-card ds-card-hover p-4 sm:p-5 lg:p-6 hover:bg-[var(--accent-blue)]/5 hover:border-[var(--accent-blue)]/30"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-dark)] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-500 ease-out shadow-[0_4px_15px_rgba(58,134,255,0.3)]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl ds-subheading mb-2 sm:mb-3 group-hover:text-[var(--accent-blue)] transition-all duration-500 ease-out">
                Job suchen
              </h2>
              <p className="ds-body-light text-xs sm:text-sm leading-relaxed font-light">
                Als Bewerber passende Stellen finden und sich mit unserem intelligenten Matching-System bewerben
              </p>
            </div>
          </Link>
          
          {/* Company Card */}
          <Link 
            href="/company/choose" 
            className="group relative ds-card ds-card-hover p-4 sm:p-5 lg:p-6 hover:bg-[var(--accent-green)]/5 hover:border-[var(--accent-green)]/30"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-green-dark)] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-500 ease-out shadow-[0_4px_15px_rgba(6,199,85,0.3)]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl ds-subheading mb-2 sm:mb-3 group-hover:text-[var(--accent-green)] transition-all duration-500 ease-out">
                Stellen anbieten
              </h2>
              <p className="ds-body-light text-xs sm:text-sm leading-relaxed font-light">
                Als Unternehmen Talente finden und Stellen mit unserem erweiterten Matching-Algorithmus ausschreiben
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
