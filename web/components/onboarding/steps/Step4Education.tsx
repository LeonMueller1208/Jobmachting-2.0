"use client";

const availableEducation = [
  "Hauptschulabschluss",
  "Realschulabschluss",
  "Abitur",
  "Bachelor",
  "Master",
  "Promotion"
];

const fieldCategories = [
  "Wirtschaft",
  "Ingenieurwesen",
  "Sonstige"
];

const fieldsByCategory: Record<string, string[]> = {
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

interface Step4EducationProps {
  education: string;
  setEducation: (value: string) => void;
  fieldOfStudyCategory: string;
  setFieldOfStudyCategory: (value: string) => void;
  fieldOfStudy: string;
  setFieldOfStudy: (value: string) => void;
  onSkip: () => void;
}

export default function Step4Education({ 
  education, 
  setEducation, 
  fieldOfStudyCategory,
  setFieldOfStudyCategory,
  fieldOfStudy,
  setFieldOfStudy,
  onSkip 
}: Step4EducationProps) {
  
  const showFieldOfStudy = requiresFieldOfStudy(education);
  
  // Reset field of study when education changes to non-university
  const handleEducationChange = (value: string) => {
    setEducation(value);
    if (!requiresFieldOfStudy(value)) {
      setFieldOfStudyCategory("");
      setFieldOfStudy("");
    }
  };

  // Reset field when category changes
  const handleCategoryChange = (value: string) => {
    setFieldOfStudyCategory(value);
    setFieldOfStudy("");
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Deine Bildung 🎓</h2>
        <p className="ds-body-light text-base sm:text-lg">Was ist dein höchster Abschluss?</p>
      </div>

      {/* Education Dropdown */}
      <div>
        <label className="ds-label text-lg font-semibold mb-3 block">Höchster Abschluss (optional)</label>
        
        {/* Prominent Info Box */}
        <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-base font-semibold text-blue-900 mb-1">💡 Wichtig zu wissen:</p>
              <p className="text-sm sm:text-base text-blue-800 font-medium">
                Du kannst auch deinen <strong>aktuellen oder angestrebten</strong> Abschluss angeben! 
                Wenn du gerade im Master studierst, wähle einfach <strong>"Master"</strong> – du musst nicht bis zum Abschluss warten.
              </p>
            </div>
          </div>
        </div>
        
        <select
          value={education}
          onChange={(e) => handleEducationChange(e.target.value)}
          className="ds-input ds-input-focus-blue text-lg"
        >
          <option value="">Abschluss wählen...</option>
          {availableEducation.map(edu => (
            <option key={edu} value={edu}>{edu}</option>
          ))}
        </select>
      </div>

      {/* Field of Study - Only for University Degrees */}
      {showFieldOfStudy && (
        <div className="space-y-4 pt-4 border-t-2 border-blue-200">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              📚 Da du einen Hochschulabschluss angegeben hast, benötigen wir noch deine Fachrichtung.
            </p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="ds-label">Fachbereich *</label>
            <select
              value={fieldOfStudyCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="ds-input ds-input-focus-blue text-lg"
            >
              <option value="">Fachbereich wählen...</option>
              {fieldCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Field of Study Dropdown - Only when category selected */}
          {fieldOfStudyCategory && (
            <div>
              <label className="ds-label">Fachrichtung *</label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="ds-input ds-input-focus-blue text-lg"
              >
                <option value="">Fachrichtung wählen...</option>
                {fieldsByCategory[fieldOfStudyCategory]?.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
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
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            Diese Angabe hilft uns, passendere Jobs für dich zu finden. Du kannst diesen Schritt aber auch überspringen.
          </p>
        </div>
      </div>
    </div>
  );
}

