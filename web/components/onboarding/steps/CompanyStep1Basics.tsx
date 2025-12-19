"use client";

import { useState } from "react";

interface CompanyStep1BasicsProps {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirm: (value: string) => void;
}

export default function CompanyStep1Basics({ 
  name, 
  email, 
  password, 
  passwordConfirm,
  setName, 
  setEmail,
  setPassword,
  setPasswordConfirm
}: CompanyStep1BasicsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const passwordMatch = passwordConfirm === "" || password === passwordConfirm;
  const passwordLengthValid = password === "" || password.length >= 8;

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

      {/* Password Input */}
      <div>
        <label className="ds-label">Passwort *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`ds-input ds-input-focus-green text-lg pr-10 ${!passwordLengthValid ? "border-red-500" : ""}`}
            placeholder="Mindestens 8 Zeichen"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {!passwordLengthValid && (
          <p className="text-sm text-red-600 mt-1">Passwort muss mindestens 8 Zeichen lang sein</p>
        )}
      </div>

      {/* Password Confirm Input */}
      <div>
        <label className="ds-label">Passwort bestätigen *</label>
        <div className="relative">
          <input
            type={showPasswordConfirm ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={`ds-input ds-input-focus-green text-lg pr-10 ${!passwordMatch && passwordConfirm !== "" ? "border-red-500" : ""}`}
            placeholder="Passwort wiederholen"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswordConfirm ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {!passwordMatch && passwordConfirm !== "" && (
          <p className="text-sm text-red-600 mt-1">Passwörter stimmen nicht überein</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            Verwenden Sie eine offizielle Unternehmens-E-Mail-Adresse für die Registrierung.
            Das Passwort wird verschlüsselt gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}

