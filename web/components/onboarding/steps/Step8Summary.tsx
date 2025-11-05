"use client";

interface Step8SummaryProps {
  formData: {
    name: string;
    email: string;
    location: string;
    experience: number;
    education: string;
    skills: string[];
    industry: string;
    bio: string;
  };
  onEdit: (step: number) => void;
}

export default function Step8Summary({ formData, onEdit }: Step8SummaryProps) {
  const getExperienceLabel = (years: number) => {
    if (years === 0) return "Keine Erfahrung";
    if (years === 1) return "1 Jahr";
    return `${years} Jahre`;
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Fast geschafft! 🎉</h2>
        <p className="ds-body-light text-base sm:text-lg">Überprüfe deine Angaben</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Basics */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">📋 Basics</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Name:</span> {formData.name}</p>
            <p><span className="font-medium text-gray-600">E-Mail:</span> {formData.email}</p>
          </div>
        </div>

        {/* Location & Experience */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">📍 Standort & Erfahrung</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Standort:</span> {formData.location}</p>
            <p><span className="font-medium text-gray-600">Erfahrung:</span> {getExperienceLabel(formData.experience)}</p>
          </div>
        </div>

        {/* Education & Industry */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🎓 Bildung & Branche</h3>
            <button
              onClick={() => onEdit(4)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600">Bildung:</span>{" "}
              {formData.education || <span className="text-gray-400 italic">Nicht angegeben</span>}
            </p>
            <p>
              <span className="font-medium text-gray-600">Branche:</span>{" "}
              {formData.industry || <span className="text-gray-400 italic">Nicht angegeben</span>}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🎯 Skills ({formData.skills.length})</h3>
            <button
              onClick={() => onEdit(5)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span key={skill} className="ds-skill-tag-blue text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        {formData.bio && (
          <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">✍️ Über dich</h3>
              <button
                onClick={() => onEdit(7)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Bearbeiten
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{formData.bio}</p>
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
              Dein Profil ist vollständig. Klicke auf "Profil erstellen" und starte deine Jobsuche! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

