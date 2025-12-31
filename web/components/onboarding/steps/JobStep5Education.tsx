"use client";

const availableEducation = [
  "Keine Angabe",
  "Hauptschulabschluss",
  "Realschulabschluss",
  "Abitur",
  "Bachelor",
  "Master",
  "Promotion"
];

const fieldsOfStudy = {
  "Wirtschaft": [
    "BWL (Betriebswirtschaftslehre)",
    "VWL (Volkswirtschaftslehre)",
    "Wirtschaftswissenschaften",
    "Wirtschaftsinformatik",
    "Wirtschaftsingenieurwesen",
    "International Business",
    "Finance / Banking",
    "Marketing / Vertrieb",
    "Wirtschaftsrecht"
  ],
  "Ingenieurwesen": [
    "Maschinenbau",
    "Elektrotechnik / Elektronik",
    "Informatik",
    "Bauingenieurwesen",
    "Wirtschaftsingenieurwesen",
    "Mechatronik",
    "Verfahrenstechnik / Chemieingenieurwesen",
    "Produktions- und Automatisierungstechnik",
    "Umwelt- und Energietechnik"
  ],
  "Sonstige": [
    "Andere Fachrichtung"
  ]
};

const requiresFieldOfStudy = (education: string) => {
  return ["Bachelor", "Master", "Diplom", "Promotion"].includes(education);
};

interface JobStep5EducationProps {
  requiredEducation: string;
  setRequiredEducation: (value: string) => void;
  requiredFieldsOfStudy: string[];
  setRequiredFieldsOfStudy: (value: string[]) => void;
  onSkip: () => void;
}

export default function JobStep5Education({ 
  requiredEducation, 
  setRequiredEducation,
  requiredFieldsOfStudy,
  setRequiredFieldsOfStudy,
  onSkip 
}: JobStep5EducationProps) {
  
  const showFieldsOfStudy = requiresFieldOfStudy(requiredEducation);

  const handleEducationChange = (value: string) => {
    setRequiredEducation(value);
    if (!requiresFieldOfStudy(value)) {
      setRequiredFieldsOfStudy([]);
    }
  };

  const toggleFieldOfStudy = (field: string) => {
    if (requiredFieldsOfStudy.includes(field)) {
      setRequiredFieldsOfStudy(requiredFieldsOfStudy.filter(f => f !== field));
    } else {
      setRequiredFieldsOfStudy([...requiredFieldsOfStudy, field]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Erforderliche Bildung 🎓</h2>
        <p className="ds-body-light text-base sm:text-lg">Welcher Abschluss wird benötigt?</p>
      </div>

      {/* Education Dropdown */}
      <div>
        <label className="ds-label">Mindest-Abschluss (optional)</label>
        <select
          value={requiredEducation}
          onChange={(e) => handleEducationChange(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
        >
          <option value="">Abschluss wählen...</option>
          {availableEducation.map(edu => (
            <option key={edu} value={edu}>{edu}</option>
          ))}
        </select>
      </div>

      {/* Fields of Study - Only for University Degrees */}
      {showFieldsOfStudy && (
        <div className="space-y-4 pt-4 border-t-2 border-green-200">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">
              📚 Gewünschte Fachrichtungen (optional, Mehrfachauswahl)
            </p>
            <p className="text-xs text-green-700">
              Wenn Sie keine Fachrichtung auswählen, werden alle Fachrichtungen akzeptiert.
            </p>
          </div>

          {/* Checkboxes by Category */}
          {Object.entries(fieldsOfStudy).map(([category, fields]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b border-gray-300 pb-1">
                {category}
              </h3>
              <div className="space-y-2 pl-2">
                {fields.map(field => (
                  <label key={field} className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={requiredFieldsOfStudy.includes(field)}
                      onChange={() => toggleFieldOfStudy(field)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Selected Count */}
          {requiredFieldsOfStudy.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ✓ <strong>{requiredFieldsOfStudy.length}</strong> Fachrichtung{requiredFieldsOfStudy.length !== 1 ? 'en' : ''} ausgewählt
              </p>
            </div>
          )}
        </div>
      )}

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-[var(--border-radius-button)]"
      >
        Überspringen →
      </button>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            Diese Angabe ist optional. Wenn Sie keinen spezifischen Abschluss voraussetzen, können Sie diesen Schritt überspringen.
          </p>
        </div>
      </div>
    </div>
  );
}

