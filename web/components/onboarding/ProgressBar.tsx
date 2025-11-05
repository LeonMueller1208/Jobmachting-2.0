interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step Counter */}
      <div className="text-center mb-3">
        <span className="text-sm font-medium text-gray-600">
          Schritt {currentStep} von {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Dots */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index + 1 <= currentStep
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

