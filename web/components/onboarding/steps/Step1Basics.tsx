"use client";

import { useState } from "react";

interface Step1BasicsProps {
  name: string;
  setName: (value: string) => void;
}

export default function Step1Basics({ 
  name, 
  setName
}: Step1BasicsProps) {

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

    </div>
  );
}

