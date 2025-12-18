"use client";

interface Props {
  hierarchy: number;
  autonomy: number;
  teamwork: number;
  workStructure: number;
  feedback: number;
  flexibility: number;
  setHierarchy: (value: number) => void;
  setAutonomy: (value: number) => void;
  setTeamwork: (value: number) => void;
  setWorkStructure: (value: number) => void;
  setFeedback: (value: number) => void;
  setFlexibility: (value: number) => void;
  colorScheme?: "blue" | "green";
}

const HIERARCHY_OPTIONS = [
  { value: 1, label: "Sehr flach", description: "Entscheidungen auf Augenhöhe" },
  { value: 2, label: "Eher flach", description: "Führung gibt Orientierung" },
  { value: 3, label: "Eher klar", description: "Feste Ebenen helfen mir" },
  { value: 4, label: "Sehr klar", description: "Hierarchie gibt mir Sicherheit" }
];

const AUTONOMY_OPTIONS = [
  { value: 1, label: "Sehr wenig", description: "Klare Vorgaben sind mir wichtig" },
  { value: 2, label: "Etwas", description: "Mit klaren Rahmenbedingungen" },
  { value: 3, label: "Viel", description: "Ich treffe viele Entscheidungen selbst" },
  { value: 4, label: "Sehr viel", description: "Maximale Eigenverantwortung" }
];

const TEAMWORK_OPTIONS = [
  { value: 1, label: "Sehr wichtig", description: "Ich arbeite fast immer im Team" },
  { value: 2, label: "Wichtig", description: "Mischung aus Team- und Einzelarbeit" },
  { value: 3, label: "Eher unwichtig", description: "Ich arbeite meist allein" },
  { value: 4, label: "Unwichtig", description: "Ich arbeite am liebsten selbstständig" }
];

const FLEXIBILITY_OPTIONS = [
  { value: 1, label: "Sehr wichtig", description: "Ohne Flexibilität geht es nicht" },
  { value: 2, label: "Wichtig", description: "Ein Plus, aber kein Muss" },
  { value: 3, label: "Eher unwichtig", description: "Feste Zeiten sind okay" },
  { value: 4, label: "Unwichtig", description: "Feste Strukturen bevorzuge ich" }
];

const SCALE_OPTIONS = [
  { value: 1, label: "Trifft gar nicht zu" },
  { value: 2, label: "Trifft eher nicht zu" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Trifft eher zu" },
  { value: 5, label: "Trifft voll zu" }
];

export default function CultureFitSelector({
  hierarchy,
  autonomy,
  teamwork,
  workStructure,
  feedback,
  flexibility,
  setHierarchy,
  setAutonomy,
  setTeamwork,
  setWorkStructure,
  setFeedback,
  setFlexibility,
  colorScheme = "blue"
}: Props) {
  const accentColor = colorScheme === "blue" ? "blue" : "green";
  const inputClass = `ds-input ds-input-focus-${accentColor}`;

  return (
    <div className="space-y-6">
      {/* Hierarchy */}
      <div>
        <label className="ds-label">Hierarchie</label>
        <select
          value={hierarchy || ""}
          onChange={(e) => setHierarchy(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {HIERARCHY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} – {opt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Autonomy */}
      <div>
        <label className="ds-label">Autonomie</label>
        <select
          value={autonomy || ""}
          onChange={(e) => setAutonomy(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {AUTONOMY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} – {opt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Teamwork */}
      <div>
        <label className="ds-label">Teamarbeit</label>
        <select
          value={teamwork || ""}
          onChange={(e) => setTeamwork(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {TEAMWORK_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} – {opt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Work Structure */}
      <div>
        <label className="ds-label">Arbeitsstruktur: Ich arbeite am liebsten in einem strukturierten und planbaren Arbeitsalltag.</label>
        <select
          value={workStructure || ""}
          onChange={(e) => setWorkStructure(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {SCALE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.value} – {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      <div>
        <label className="ds-label">Feedback & Kommunikation: Ich wünsche mir regelmäßiges und klares Feedback zu meiner Arbeit.</label>
        <select
          value={feedback || ""}
          onChange={(e) => setFeedback(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {SCALE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.value} – {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Flexibility */}
      <div>
        <label className="ds-label">Flexibilität</label>
        <select
          value={flexibility || ""}
          onChange={(e) => setFlexibility(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Wählen...</option>
          {FLEXIBILITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} – {opt.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

