"use client";

interface JobStep1TitleProps {
  title: string;
  setTitle: (value: string) => void;
}

export default function JobStep1Title({ title, setTitle }: JobStep1TitleProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Neue Stelle erstellen 💼</h2>
        <p className="ds-body-light text-base sm:text-lg">Wie lautet der Stellentitel?</p>
      </div>

      {/* Title Input */}
      <div>
        <label className="ds-label">Stellentitel *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
          placeholder="z.B. Senior React Developer"
        />
      </div>

      {/* Examples */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1 text-sm">💡 Beispiele für gute Titel:</h4>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• "Senior Full-Stack Developer (m/w/d)"</li>
              <li>• "Marketing Manager für Social Media"</li>
              <li>• "Werkstudent im Bereich Data Science"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

