"use client";

interface Props {
  teamwork: number;
  setTeamwork: (value: number) => void;
}

const OPTIONS = [
  { 
    value: 1, 
    label: "Sehr wichtig", 
    description: "Fast immer im Team arbeiten",
    icon: "👥"
  },
  { 
    value: 2, 
    label: "Wichtig", 
    description: "Mischung aus Team- und Einzelarbeit",
    icon: "🤝"
  },
  { 
    value: 3, 
    label: "Eher unwichtig", 
    description: "Meist allein arbeiten",
    icon: "👤"
  },
  { 
    value: 4, 
    label: "Unwichtig", 
    description: "Am liebsten selbstständig arbeiten",
    icon: "🎯"
  }
];

export default function JobStep9Teamwork({ teamwork, setTeamwork }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          👥 Wie wichtig ist Teamarbeit in dieser Stelle?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Beschreibt die Arbeitsweise für diese Position
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTeamwork(option.value)}
            className={`
              w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${teamwork === option.value
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
                  {teamwork === option.value && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!teamwork && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Option aus
        </div>
      )}
    </div>
  );
}

