"use client";

interface CompanyStep1BasicsProps {
  name: string;
  email: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}

export default function CompanyStep1Basics({ name, email, setName, setEmail }: CompanyStep1BasicsProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Willkommen! 🏢</h2>
        <p className="ds-body-light text-base sm:text-lg">Registrieren Sie Ihr Unternehmen</p>
      </div>

      {/* Name Input */}
      <div>
        <label className="ds-label">Unternehmensname *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
          placeholder="Ihre Firma GmbH"
          autoFocus
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="ds-label">Unternehmens-E-Mail *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
          placeholder="kontakt@firma.de"
        />
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            Verwenden Sie eine offizielle Unternehmens-E-Mail-Adresse für die Registrierung.
          </p>
        </div>
      </div>
    </div>
  );
}

