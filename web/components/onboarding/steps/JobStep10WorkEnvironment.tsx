"use client";

interface Props {
  workEnvironment: string;
  setWorkEnvironment: (value: string) => void;
}

const OPTIONS = [
  { 
    id: "quiet", 
    label: "Ruhig & konzentriert", 
    icon: "🤫",
    description: "Wenig Ablenkung, fokussiertes Arbeiten"
  },
  { 
    id: "lively", 
    label: "Lebendig & kommunikativ", 
    icon: "💬",
    description: "Viel Austausch, dynamische Atmosphäre"
  },
  { 
    id: "structured", 
    label: "Strukturiert & klar organisiert", 
    icon: "📋",
    description: "Klare Prozesse, geordnete Abläufe"
  }
];

export default function JobStep10WorkEnvironment({ workEnvironment, setWorkEnvironment }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          🏢 Wie ist euer Arbeitsumfeld?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Wähle die Atmosphäre, die euer Büro/Team am besten beschreibt
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => setWorkEnvironment(option.id)}
            className={`
              w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${workEnvironment === option.id
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
                  {workEnvironment === option.id && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!workEnvironment && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Option aus
        </div>
      )}
    </div>
  );
}

