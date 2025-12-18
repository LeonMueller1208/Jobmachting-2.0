"use client";

interface Props {
  hierarchy: number;
  setHierarchy: (value: number) => void;
}

const OPTIONS = [
  { 
    value: 1, 
    label: "Sehr flach", 
    description: "Entscheidungen auf Augenhöhe",
    icon: "🤝"
  },
  { 
    value: 2, 
    label: "Eher flach", 
    description: "Führung gibt Orientierung",
    icon: "👥"
  },
  { 
    value: 3, 
    label: "Eher klar", 
    description: "Feste Ebenen helfen",
    icon: "📊"
  },
  { 
    value: 4, 
    label: "Sehr klar", 
    description: "Hierarchie gibt Sicherheit",
    icon: "🏛️"
  }
];

export default function JobStep7Hierarchy({ hierarchy, setHierarchy }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          🏛️ Welche Art von Hierarchie hat euer Unternehmen?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Beschreibt die Hierarchiestruktur eures Teams
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => setHierarchy(option.value)}
            className={`
              w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${hierarchy === option.value
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
                  {hierarchy === option.value && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!hierarchy && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Option aus
        </div>
      )}
    </div>
  );
}

