"use client";

import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
  showLogout?: boolean;
  userType?: "applicant" | "company";
}

export default function Header({ showBackButton = false, backHref = "/", title, showLogout = false, userType }: HeaderProps) {
  const handleLogout = () => {
    if (userType === "applicant") {
      localStorage.removeItem("applicantSession");
    } else if (userType === "company") {
      localStorage.removeItem("companySession");
    }
    window.location.href = "/";
  };

  return (
    <header className="ds-background border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between min-h-[60px] sm:min-h-[auto]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo size="sm" variant="gradient" className="sm:hidden" />
            <Logo size="md" variant="gradient" className="hidden sm:block" />
          </Link>

          {/* Title - Mobile Responsive */}
          {title && (
            <h1 className="text-sm sm:text-lg ds-subheading text-center flex-1 mx-2 sm:mx-4 truncate">
              {title}
            </h1>
          )}

          {/* Right Side Actions - Mobile Optimized */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Back Button - Mobile Icons Only */}
            {showBackButton && (
              <Link 
                href={backHref}
                className="ds-button-secondary flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Zurück</span>
              </Link>
            )}

            {/* Logout Button - Mobile Icons Only */}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="ds-button-secondary flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Abmelden</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
