"use client";

interface Props {
  workValues: string[];
  setWorkValues: (values: string[]) => void;
}

const OPTIONS = [
  { 
    id: "security", 
    label: "Sicherheit & Stabilität", 
    icon: "🛡️",
    description: "Langfristige Perspektiven, sichere Strukturen"
  },
  { 
    id: "fun", 
    label: "Spaß & gute Atmosphäre", 
    icon: "🎉",
    description: "Lockeres Miteinander, positive Stimmung"
  },
  { 
    id: "development", 
    label: "Entwicklung & Lernen", 
    icon: "📈",
    description: "Weiterbildung, persönliches Wachstum"
  },
  { 
    id: "purpose", 
    label: "Sinn & gesellschaftlicher Beitrag", 
    icon: "🌍",
    description: "Positive Wirkung, sinnvolle Arbeit"
  }
];

export default function JobStep8WorkValues({ workValues, setWorkValues }: Props) {
  function toggleValue(id: string) {
    if (workValues.includes(id)) {
      setWorkValues(workValues.filter(v => v !== id));
    } else {
      // Allow max 2 selections
      if (workValues.length < 2) {
        setWorkValues([...workValues, id]);
      } else {
        // Replace oldest selection
        setWorkValues([workValues[1], id]);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          🎯 Was beschreibt euer Team am besten?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Wähle 1-2 Dinge aus, die bei euch besonders wichtig sind
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => toggleValue(option.id)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${workValues.includes(option.id)
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
                  {workValues.includes(option.id) && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {workValues.length === 0 && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle mindestens einen Wert aus
        </div>
      )}

      {workValues.length > 0 && (
        <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          ✓ {workValues.length} {workValues.length === 1 ? 'Wert' : 'Werte'} ausgewählt
        </div>
      )}
    </div>
  );
}

