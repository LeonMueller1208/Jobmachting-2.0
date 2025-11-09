"use client";

interface Props {
  motivation: string;
  setMotivation: (value: string) => void;
}

const OPTIONS = [
  { 
    id: "recognition", 
    label: "Anerkennung & Wertschätzung", 
    icon: "🏆",
    description: "Lob, Feedback, gesehen werden"
  },
  { 
    id: "responsibility", 
    label: "Verantwortung & Selbstständigkeit", 
    icon: "🎯",
    description: "Eigene Entscheidungen treffen"
  },
  { 
    id: "success", 
    label: "Erfolg & Zielerreichung", 
    icon: "📊",
    description: "Ergebnisse sehen, Ziele erreichen"
  },
  { 
    id: "learning", 
    label: "Neues lernen & Innovation", 
    icon: "💡",
    description: "Ständig dazulernen, neue Wege gehen"
  }
];

export default function Step10Motivation({ motivation, setMotivation }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          ⚡ Was motiviert dich am meisten?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Wähle deinen wichtigsten Motivator
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => setMotivation(option.id)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${motivation === option.id
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
                  {motivation === option.id && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!motivation && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Option aus
        </div>
      )}
    </div>
  );
}

