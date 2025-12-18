"use client";

interface Props {
  feedback: number;
  setFeedback: (value: number) => void;
}

const SCALE_OPTIONS = [
  { value: 1, label: "Trifft gar nicht zu", emoji: "❌" },
  { value: 2, label: "Trifft eher nicht zu", emoji: "👎" },
  { value: 3, label: "Neutral", emoji: "➖" },
  { value: 4, label: "Trifft eher zu", emoji: "👍" },
  { value: 5, label: "Trifft voll zu", emoji: "✅" }
];

export default function Step11Feedback({ feedback, setFeedback }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          💬 Feedback & Kommunikation
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Ich wünsche mir regelmäßiges und klares Feedback zu meiner Arbeit.
        </p>
        <p className="text-sm text-gray-500">
          Bewerte auf einer Skala von 1 bis 5
        </p>
      </div>

      <div className="space-y-3">
        {SCALE_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFeedback(option.value)}
            className={`
              w-full p-5 rounded-xl border-2 transition-all duration-300 text-left
              ${feedback === option.value
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{option.emoji}</span>
                <span className="font-semibold text-gray-800">{option.label}</span>
              </div>
              {feedback === option.value && (
                <span className="text-green-500 text-2xl font-bold">{option.value}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {!feedback && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          ⚠️ Bitte wähle eine Bewertung aus
        </div>
      )}
    </div>
  );
}

