"use client";

interface JobStep2DescriptionProps {
  description: string;
  setDescription: (value: string) => void;
}

export default function JobStep2Description({ description, setDescription }: JobStep2DescriptionProps) {
  const charCount = description.length;
  const minChars = 50;
  const maxChars = 500;

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Stellenbeschreibung 📝</h2>
        <p className="ds-body-light text-base sm:text-lg">Beschreiben Sie die Position im Detail</p>
      </div>

      {/* Description Textarea */}
      <div>
        <label className="ds-label">Beschreibung * ({minChars}-{maxChars} Zeichen)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="ds-input ds-input-focus-green text-base min-h-[180px]"
          rows={7}
          maxLength={maxChars}
          placeholder="Kurz & knackig! Beschreiben Sie:&#10;• Die Hauptaufgaben (2-3 Punkte)&#10;• Must-Have Skills&#10;• Was Sie bieten (Remote, Benefits, etc.)"
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${charCount < minChars ? 'text-orange-600' : charCount > 400 ? 'text-orange-600' : 'text-gray-500'}`}>
            {charCount < minChars 
              ? `Noch ${minChars - charCount} Zeichen bis Minimum` 
              : charCount > 400
              ? `${charCount} / ${maxChars} - Fast am Limit!`
              : `${charCount} / ${maxChars} Zeichen`}
          </p>
          {charCount >= minChars && charCount <= 400 && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Perfekte Länge!
            </p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1 text-sm">💡 Pro-Tipp:</h4>
            <p className="text-xs text-green-800">
              <strong>Kurz & prägnant schlägt lang & langweilig!</strong> Bewerber schätzen klare, ehrliche Beschreibungen ohne Baustein-Texte. Fokus auf das Wesentliche!
            </p>
          </div>
        </div>
      </div>

      {/* Warning Box if too long */}
      {charCount > 400 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg animate-pulse">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-orange-900 mb-1 text-sm">⚠️ Achtung:</h4>
              <p className="text-xs text-orange-800">
                Zu lange Texte schrecken Bewerber ab! Versuchen Sie, auf den Punkt zu kommen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

