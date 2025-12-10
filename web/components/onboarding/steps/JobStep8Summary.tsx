"use client";

interface JobStep8SummaryProps {
  formData: {
    title: string;
    description: string;
    location: string;
    jobType: string;
    minExperience: number;
    requiredEducation: string;
    requiredSkills: string[];
    industry: string;
    workValues: string[];
    teamStyle: string;
    workEnvironment: string;
    motivation: string;
  };
  onEdit: (step: number) => void;
}

const WORK_VALUES_LABELS: { [key: string]: string } = {
  security: "🛡️ Sicherheit & Stabilität",
  fun: "🎉 Spaß & Atmosphäre",
  development: "📈 Entwicklung & Lernen",
  purpose: "🌍 Sinn & Beitrag"
};

const TEAM_STYLE_LABELS: { [key: string]: string } = {
  close: "👥 Eng im Team",
  balanced: "🤝 Ausgewogen",
  independent: "🎯 Eigenständig"
};

const WORK_ENV_LABELS: { [key: string]: string } = {
  quiet: "🤫 Ruhig & konzentriert",
  lively: "💬 Lebendig & kommunikativ",
  structured: "📋 Strukturiert & organisiert"
};

const MOTIVATION_LABELS: { [key: string]: string } = {
  recognition: "🏆 Anerkennung",
  responsibility: "🎯 Verantwortung",
  success: "📊 Erfolg",
  learning: "💡 Lernen & Innovation"
};

export default function JobStep8Summary({ formData, onEdit }: JobStep8SummaryProps) {
  const getExperienceLabel = (years: number) => {
    if (years === 0) return "Keine Erfahrung erforderlich";
    if (years === 1) return "1 Jahr";
    if (years >= 2 && years <= 5) return `${years} Jahre`;
    if (years === 6) return "5-10 Jahre";
    if (years === 11) return "10-15 Jahre";
    if (years === 16) return "15-20 Jahre";
    if (years === 21) return "Über 20 Jahre";
    return `${years} Jahre`;
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Fast geschafft! 🎉</h2>
        <p className="ds-body-light text-base sm:text-lg">Überprüfen Sie Ihre Stellenausschreibung</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Title */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">💼 Stellentitel</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <p className="text-sm text-gray-700">{formData.title}</p>
        </div>

        {/* Description */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">📝 Beschreibung</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{formData.description}</p>
        </div>

        {/* Location & Type */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">📍 Standort & Art</h3>
            <button
              onClick={() => onEdit(3)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Standort:</span> {formData.location}</p>
            <p><span className="font-medium text-gray-600">Beschäftigungsart:</span> {formData.jobType}</p>
          </div>
        </div>

        {/* Experience & Education */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🎓 Anforderungen</h3>
            <button
              onClick={() => onEdit(4)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Min. Erfahrung:</span> {getExperienceLabel(formData.minExperience)}</p>
            <p>
              <span className="font-medium text-gray-600">Bildung:</span>{" "}
              {formData.requiredEducation || <span className="text-gray-400 italic">Nicht angegeben</span>}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🎯 Benötigte Skills ({formData.requiredSkills.length})</h3>
            <button
              onClick={() => onEdit(6)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.requiredSkills.map(skill => (
              <span key={skill} className="ds-skill-tag-green text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Soft Factors - Cultural Fit */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🤝 Team-Kultur & Werte</h3>
            <button
              onClick={() => onEdit(8)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Was euch wichtig ist:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.workValues.map(val => (
                  <span key={val} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-700 border border-purple-200">
                    {WORK_VALUES_LABELS[val] || val}
                  </span>
                ))}
              </div>
            </div>
            <p>
              <span className="font-medium text-gray-700">Teamarbeit:</span>{" "}
              <span className="text-gray-800">{TEAM_STYLE_LABELS[formData.teamStyle] || formData.teamStyle}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Arbeitsumfeld:</span>{" "}
              <span className="text-gray-800">{WORK_ENV_LABELS[formData.workEnvironment] || formData.workEnvironment}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Motivation:</span>{" "}
              <span className="text-gray-800">{MOTIVATION_LABELS[formData.motivation] || formData.motivation}</span>
            </p>
          </div>
        </div>

        {/* Industry */}
        {formData.industry && (
          <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">🏢 Branche</h3>
              <button
                onClick={() => onEdit(7)}
                className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Bearbeiten
              </button>
            </div>
            <p className="text-sm text-gray-700">{formData.industry}</p>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Alles bereit!</h4>
            <p className="text-sm text-green-800">
              Ihre Stellenausschreibung ist vollständig. Klicken Sie auf "Stelle veröffentlichen" und erreichen Sie passende Bewerber! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

