"use client";

const availableLocations = [
  'Berlin', 'München', 'Hamburg', 'Kassel', 'Kassel Umgebung', 'Köln', 'Frankfurt', 'Stuttgart', 
  'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 
  'Hannover', 'Nürnberg', 'Remote'
];

interface CompanyStep3LocationProps {
  location: string;
  setLocation: (value: string) => void;
}

export default function CompanyStep3Location({ location, setLocation }: CompanyStep3LocationProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Ihr Standort 📍</h2>
        <p className="ds-body-light text-base sm:text-lg">Wo befindet sich Ihr Hauptsitz?</p>
      </div>

      {/* Location Dropdown */}
      <div>
        <label className="ds-label">Standort *</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="ds-input ds-input-focus-green text-lg"
          autoFocus
        >
          <option value="">Standort wählen...</option>
          {availableLocations.map(city => (
            <option key={city} value={city}>{city}</option>
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
            Der Standort wird Bewerbern aus Ihrer Region angezeigt. Sie können später auch Remote-Jobs anbieten.
          </p>
        </div>
      </div>
    </div>
  );
}

