"use client";

interface Step3ExperienceProps {
  experience: number;
  setExperience: (value: number) => void;
}

// Helper function to get experience options
const getExperienceOptions = () => {
  const options = [];
  // 0-5 years (exact)
  for (let i = 0; i <= 5; i++) {
    options.push({ value: i, label: i === 0 ? "Keine Erfahrung" : i === 1 ? "1 Jahr" : `${i} Jahre` });
  }
  // Ranges
  options.push({ value: 6, label: "5-10 Jahre" });
  options.push({ value: 11, label: "10-15 Jahre" });
  options.push({ value: 16, label: "15-20 Jahre" });
  options.push({ value: 21, label: "Über 20 Jahre" });
  return options;
};

// Helper function to get display label for experience value
const getExperienceDisplayLabel = (value: number) => {
  if (value === 0) return "Keine Erfahrung";
  if (value === 1) return "1 Jahr";
  if (value >= 2 && value <= 5) return `${value} Jahre`;
  if (value === 6) return "5-10 Jahre";
  if (value === 11) return "10-15 Jahre";
  if (value === 16) return "15-20 Jahre";
  if (value === 21) return "Über 20 Jahre";
  return `${value} Jahre`;
};

export default function Step3Experience({ experience, setExperience }: Step3ExperienceProps) {
  const experienceOptions = getExperienceOptions();
  
  // Visual representation based on experience
  const getExperienceIcon = () => {
    if (experience === 0) return "🚀";
    if (experience <= 2) return "🌱";
    if (experience <= 5) return "💼";
    if (experience <= 6 || (experience > 6 && experience <= 11)) return "🏆";
    return "👑";
  };

  const getExperienceLabel = () => {
    if (experience === 0) return "Berufseinsteiger";
    if (experience <= 2) return "Junior Level";
    if (experience <= 5) return "Mid Level";
    if (experience === 6 || (experience > 6 && experience <= 11)) return "Senior Level";
    return "Expert Level";
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Deine Erfahrung 💪</h2>
        <p className="ds-body-light text-base sm:text-lg">Wie viele Jahre Berufserfahrung hast du?</p>
      </div>

      {/* Experience Dropdown */}
      <div>
        <label className="ds-label">Berufserfahrung (Jahre) *</label>
        <select
          value={experience}
          onChange={(e) => setExperience(Number(e.target.value))}
          className="ds-input ds-input-focus-blue text-lg"
        >
          {experienceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Visual Feedback */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl text-center">
        <div className="text-5xl mb-3">{getExperienceIcon()}</div>
        <p className="text-xl font-semibold text-gray-800">{getExperienceLabel()}</p>
        <p className="text-sm text-gray-600 mt-2">
          {experience === 0 && "Perfekt für Einstiegspositionen!"}
          {experience > 0 && experience <= 2 && "Ideal für Junior-Rollen!"}
          {experience > 2 && experience <= 5 && "Passend für Mid-Level Jobs!"}
          {(experience === 6 || (experience > 6 && experience <= 11)) && "Perfekt für Senior-Positionen!"}
          {(experience === 16 || experience === 21) && "Ideal für Leadership-Rollen!"}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            Zähle alle relevanten Berufsjahre, auch aus verschiedenen Branchen.
          </p>
        </div>
      </div>
    </div>
  );
}

