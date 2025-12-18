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
    hierarchy: number;
    autonomy: number;
    teamwork: number;
    workStructure: number;
    feedback: number;
    flexibility: number;
    bio: string;
  };
  onEdit: (step: number) => void;
}

const HIERARCHY_LABELS: { [key: number]: string } = {
  1: "Sehr flach – Entscheidungen auf Augenhöhe",
  2: "Eher flach – Führung gibt Orientierung",
  3: "Eher klar – feste Ebenen helfen mir",
  4: "Sehr klar – Hierarchie gibt mir Sicherheit"
};

const AUTONOMY_LABELS: { [key: number]: string } = {
  1: "Sehr wenig – klare Vorgaben sind mir wichtig",
  2: "Etwas – mit klaren Rahmenbedingungen",
  3: "Viel – ich treffe viele Entscheidungen selbst",
  4: "Sehr viel – maximale Eigenverantwortung"
};

const TEAMWORK_LABELS: { [key: number]: string } = {
  1: "Sehr wichtig – ich arbeite fast immer im Team",
  2: "Wichtig – Mischung aus Team- und Einzelarbeit",
  3: "Eher unwichtig – ich arbeite meist allein",
  4: "Unwichtig – ich arbeite am liebsten selbstständig"
};

const FLEXIBILITY_LABELS: { [key: number]: string } = {
  1: "Sehr wichtig – ohne Flexibilität geht es nicht",
  2: "Wichtig – ein Plus, aber kein Muss",
  3: "Eher unwichtig – feste Zeiten sind okay",
  4: "Unwichtig – feste Strukturen bevorzuge ich"
};

const SCALE_LABELS: { [key: number]: string } = {
  1: "Trifft gar nicht zu",
  2: "Trifft eher nicht zu",
  3: "Neutral",
  4: "Trifft eher zu",
  5: "Trifft voll zu"
};

export default function Step8Summary({ formData, onEdit }: Step8SummaryProps) {
  const getExperienceLabel = (years: number) => {
    if (years === 0) return "Keine Erfahrung";
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

        {/* Soft Factors - Cultural Fit */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🤝 Arbeitskultur & Werte</h3>
            <button
              onClick={() => onEdit(7)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium text-gray-700">Hierarchie:</span>{" "}
              <span className="text-gray-800">{HIERARCHY_LABELS[formData.hierarchy] || "Nicht angegeben"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Autonomie:</span>{" "}
              <span className="text-gray-800">{AUTONOMY_LABELS[formData.autonomy] || "Nicht angegeben"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Teamarbeit:</span>{" "}
              <span className="text-gray-800">{TEAMWORK_LABELS[formData.teamwork] || "Nicht angegeben"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Arbeitsstruktur:</span>{" "}
              <span className="text-gray-800">{SCALE_LABELS[formData.workStructure] || "Nicht angegeben"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Feedback & Kommunikation:</span>{" "}
              <span className="text-gray-800">{SCALE_LABELS[formData.feedback] || "Nicht angegeben"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Flexibilität:</span>{" "}
              <span className="text-gray-800">{FLEXIBILITY_LABELS[formData.flexibility] || "Nicht angegeben"}</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        {formData.bio && (
          <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">✍️ Über dich</h3>
              <button
                onClick={() => onEdit(13)}
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

