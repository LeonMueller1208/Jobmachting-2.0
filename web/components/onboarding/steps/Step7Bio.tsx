"use client";

interface Step7BioProps {
  bio: string;
  setBio: (value: string) => void;
  onSkip: () => void;
}

export default function Step7Bio({ bio, setBio, onSkip }: Step7BioProps) {
  const charCount = bio.length;
  const maxChars = 500;

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Über dich ✍️</h2>
        <p className="ds-body-light text-base sm:text-lg">Erzähl uns kurz über dich (optional)</p>
      </div>

      {/* Bio Textarea */}
      <div>
        <label className="ds-label">Kurze Beschreibung (optional)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="ds-input ds-input-focus-blue text-base min-h-[150px]"
          rows={6}
          maxLength={maxChars}
          placeholder="Erzähle über deine Interessen, beruflichen Ziele, Stärken oder was dich ausmacht..."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {charCount === 0 ? "Noch keine Zeichen" : `${charCount} / ${maxChars} Zeichen`}
          </p>
          {charCount > 0 && (
            <p className="text-xs text-green-600 font-medium">
              Super! Das hilft Firmen, dich besser kennenzulernen 👍
            </p>
          )}
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-[var(--border-radius-button)]"
      >
        Überspringen →
      </button>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            <strong>Pro-Tipp:</strong> Eine persönliche Beschreibung erhöht deine Chancen, von Firmen kontaktiert zu werden!
          </p>
        </div>
      </div>
    </div>
  );
}

