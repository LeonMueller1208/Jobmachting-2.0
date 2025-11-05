"use client";

const availableSkills = [
  "JavaScript", "Python", "Java", "React", "SQL", "HTML/CSS", "Node.js", "TypeScript",
  "Projektmanagement", "Teamführung", "Kommunikation", "Kundenbetreuung", "Marketing", "Verkauf",
  "Buchhaltung", "Datenanalyse", "Präsentationen", "MS Office", "Qualitätssicherung", "Logistik"
];

interface Step5SkillsProps {
  skills: string[];
  setSkills: (value: string[]) => void;
}

export default function Step5Skills({ skills, setSkills }: Step5SkillsProps) {
  function toggleSkill(skill: string) {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Deine Skills 🎯</h2>
        <p className="ds-body-light text-base sm:text-lg">Wähle mindestens 1 Skill aus</p>
      </div>

      {/* Skills Counter */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl text-center">
        <p className="text-lg font-semibold text-gray-800">
          {skills.length === 0 && "Noch keine Skills ausgewählt"}
          {skills.length === 1 && "1 Skill ausgewählt ✓"}
          {skills.length > 1 && `${skills.length} Skills ausgewählt ✓`}
        </p>
        {skills.length >= 3 && (
          <p className="text-sm text-green-600 mt-1">Perfekt! Je mehr Skills, desto bessere Matches! 🚀</p>
        )}
      </div>

      {/* Skills Grid */}
      <div>
        <label className="ds-label mb-3">Verfügbare Skills *</label>
        <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`text-sm px-3 py-2.5 rounded-lg border-2 transition-all duration-300 font-medium ${
                  skills.includes(skill) 
                    ? 'ds-skill-tag-blue border-blue-500 scale-105' 
                    : 'ds-skill-tag-default hover:border-blue-300'
                }`}
              >
                {skills.includes(skill) && "✓ "}
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Skills */}
      {skills.length > 0 && (
        <div>
          <p className="text-sm ds-body-light mb-2 font-medium">Deine ausgewählten Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-2 ds-skill-tag-blue text-sm">
                {skill}
                <button 
                  onClick={() => toggleSkill(skill)}
                  className="hover:text-[var(--accent-blue-dark)] transition-colors duration-300 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            <strong>Pro-Tipp:</strong> Wähle alle Skills aus, die du beherrschst - auch Soft Skills wie Kommunikation!
          </p>
        </div>
      </div>
    </div>
  );
}

