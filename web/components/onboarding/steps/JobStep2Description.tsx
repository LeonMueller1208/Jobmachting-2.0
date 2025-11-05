"use client";

interface JobStep2DescriptionProps {
  description: string;
  setDescription: (value: string) => void;
}

export default function JobStep2Description({ description, setDescription }: JobStep2DescriptionProps) {
  const charCount = description.length;
  const minChars = 50;
  const maxChars = 2000;

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
        <label className="ds-label">Beschreibung * (mind. {minChars} Zeichen)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="ds-input ds-input-focus-green text-base min-h-[200px]"
          rows={8}
          maxLength={maxChars}
          placeholder="Beschreiben Sie:&#10;• Die Aufgaben und Verantwortlichkeiten&#10;• Anforderungen an den Bewerber&#10;• Was Sie als Arbeitgeber bieten&#10;• Besonderheiten der Position"
          autoFocus
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${charCount < minChars ? 'text-orange-600' : 'text-gray-500'}`}>
            {charCount < minChars 
              ? `Noch ${minChars - charCount} Zeichen bis Minimum` 
              : `${charCount} / ${maxChars} Zeichen`}
          </p>
          {charCount >= minChars && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Gute Länge!
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
              Je detaillierter die Beschreibung, desto besser können Bewerber einschätzen, ob die Stelle zu ihnen passt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

