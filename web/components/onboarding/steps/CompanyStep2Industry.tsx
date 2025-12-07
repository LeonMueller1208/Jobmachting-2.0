"use client";

const availableIndustries = [
  "IT & Software", "Finanzwesen", "Gesundheitswesen", "E-Commerce", "Automotive", 
  "Medien & Marketing", "Bildung", "Logistik", "Energie", "Immobilien", "Sonstige"
];

interface CompanyStep2IndustryProps {
  industry: string;
  setIndustry: (value: string) => void;
}

export default function CompanyStep2Industry({ industry, setIndustry }: CompanyStep2IndustryProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Ihre Branche 🏭</h2>
        <p className="ds-body-light text-base sm:text-lg">In welcher Branche ist Ihr Unternehmen tätig?</p>
      </div>

      {/* Industry Dropdown */}
      <div>
        <label className="ds-label">Branche *</label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
        >
          <option value="">Branche wählen...</option>
          {availableIndustries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">
            Die Branche hilft Bewerbern, Ihr Unternehmen besser einzuordnen und passende Jobs zu finden.
          </p>
        </div>
      </div>
    </div>
  );
}

