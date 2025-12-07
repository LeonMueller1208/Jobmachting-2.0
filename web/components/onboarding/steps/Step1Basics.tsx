"use client";

interface Step1BasicsProps {
  name: string;
  email: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}

export default function Step1Basics({ name, email, setName, setEmail }: Step1BasicsProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Willkommen! 👋</h2>
        <p className="ds-body-light text-base sm:text-lg">Lass uns mit den Basics starten</p>
      </div>

      {/* Name Input */}
      <div>
        <label className="ds-label">Dein vollständiger Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ds-input ds-input-focus-blue text-lg"
          placeholder="Max Mustermann"
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="ds-label">Deine E-Mail-Adresse *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ds-input ds-input-focus-blue text-lg"
          placeholder="max@beispiel.de"
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            Deine Daten werden sicher gespeichert und nur für das Job-Matching verwendet.
          </p>
        </div>
      </div>
    </div>
  );
}

