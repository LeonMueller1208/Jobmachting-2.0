"use client";

interface Props {
  teamStyle: string;
  setTeamStyle: (value: string) => void;
}

const OPTIONS = [
  { 
    id: "close", 
    label: "Eng im Team mit viel Austausch", 
    icon: "👥",
    description: "Regelmäßige Meetings, enger Kontakt"
  },
  { 
    id: "balanced", 
    label: "Locker im Austausch, aber mit Freiraum", 
    icon: "🤝",
    description: "Balance zwischen Team und Eigenständigkeit"
  },
  { 
    id: "independent", 
    label: "Eher eigenständig mit klaren Feedbackpunkten", 
    icon: "🎯",
    description: "Viel Autonomie, strukturiertes Feedback"
  }
];

export default function JobStep9TeamStyle({ teamStyle, setTeamStyle }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          🤝 Wie arbeitet euer Team zusammen?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Wähle den Arbeitsstil, der euer Team am besten beschreibt
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTeamStyle(option.id)}
            className={`
              w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${teamStyle === option.id
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">{option.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  {option.label}
                  {teamStyle === option.id && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!teamStyle && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Option aus
        </div>
      )}
    </div>
  );
}

