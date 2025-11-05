"use client";

interface JobStep4ExperienceProps {
  minExperience: number;
  setMinExperience: (value: number) => void;
}

export default function JobStep4Experience({ minExperience, setMinExperience }: JobStep4ExperienceProps) {
  // Visual representation based on experience
  const getExperienceIcon = () => {
    if (minExperience === 0) return "🚀";
    if (minExperience <= 2) return "🌱";
    if (minExperience <= 5) return "💼";
    if (minExperience <= 10) return "🏆";
    return "👑";
  };

  const getExperienceLabel = () => {
    if (minExperience === 0) return "Einstiegsposition";
    if (minExperience <= 2) return "Junior Level";
    if (minExperience <= 5) return "Mid Level";
    if (minExperience <= 10) return "Senior Level";
    return "Expert/Leadership Level";
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Erforderliche Erfahrung 💪</h2>
        <p className="ds-body-light text-base sm:text-lg">Wie viele Jahre Berufserfahrung werden benötigt?</p>
      </div>

      {/* Experience Dropdown */}
      <div>
        <label className="ds-label">Mindest-Berufserfahrung (Jahre) *</label>
        <select
          value={minExperience}
          onChange={(e) => setMinExperience(Number(e.target.value))}
          className="ds-input ds-input-focus-green text-lg"
          autoFocus
        >
          {[...Array(21)].map((_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "Keine Erfahrung erforderlich" : i === 1 ? "1 Jahr" : `${i} Jahre`}
            </option>
          ))}
        </select>
      </div>

      {/* Visual Feedback */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl text-center">
        <div className="text-5xl mb-3">{getExperienceIcon()}</div>
        <p className="text-xl font-semibold text-gray-800">{getExperienceLabel()}</p>
        <p className="text-sm text-gray-600 mt-2">
          {minExperience === 0 && "Perfekt für Berufseinsteiger und Quereinsteiger!"}
          {minExperience > 0 && minExperience <= 2 && "Ideal für Junior-Profile mit ersten Erfahrungen!"}
          {minExperience > 2 && minExperience <= 5 && "Passend für erfahrene Mid-Level Kandidaten!"}
          {minExperience > 5 && minExperience <= 10 && "Für Senior-Profile mit umfassender Expertise!"}
          {minExperience > 10 && "Für hochspezialisierte Experten und Führungskräfte!"}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            Diese Angabe beeinflusst das Matching stark. Setzen Sie realistische Anforderungen, um mehr passende Bewerber zu erreichen.
          </p>
        </div>
      </div>
    </div>
  );
}

