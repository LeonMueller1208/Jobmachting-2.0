"use client";

import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
}

export default function Header({ showBackButton = false, backHref = "/", title }: HeaderProps) {
  return (
    <header className="ds-background border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" variant="gradient" />
          </Link>

          {/* Title */}
          {title && (
            <h1 className="text-lg ds-subheading text-center flex-1">
              {title}
            </h1>
          )}

          {/* Back Button */}
          {showBackButton && (
            <Link 
              href={backHref}
              className="ds-button-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
