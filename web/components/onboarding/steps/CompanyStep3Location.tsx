"use client";

const availableLocations = [
  'Berlin', 'München', 'Hamburg', 'Kassel', 'Kassel Umgebung', 'Köln', 'Frankfurt', 'Stuttgart', 
  'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 
  'Hannover', 'Nürnberg', 'Remote'
];

interface CompanyStep3LocationProps {
  location: string;
  setLocation: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  companySize: string;
  setCompanySize: (value: string) => void;
  foundedYear: string;
  setFoundedYear: (value: string) => void;
}

export default function CompanyStep3Location({ 
  location, 
  setLocation,
  description,
  setDescription,
  website,
  setWebsite,
  companySize,
  setCompanySize,
  foundedYear,
  setFoundedYear,
}: CompanyStep3LocationProps) {
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

      {/* Optional Company Profile Fields */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Zusätzliche Firmeninformationen (optional)</h3>
        <p className="text-sm text-gray-600 mb-4">Diese Informationen helfen Bewerbern, Ihr Unternehmen besser kennenzulernen.</p>
        
        <div className="space-y-6">
          <div>
            <label className="ds-label">Firmenbeschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ds-input ds-input-focus-green"
              placeholder="Beschreiben Sie Ihr Unternehmen..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ds-label">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="ds-input ds-input-focus-green"
                placeholder="https://www.unternehmen.de"
              />
            </div>
            <div>
              <label className="ds-label">Unternehmensgröße</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="ds-input ds-input-focus-green"
              >
                <option value="">Größe wählen</option>
                <option value="1-10">1-10 Mitarbeiter</option>
                <option value="11-50">11-50 Mitarbeiter</option>
                <option value="51-200">51-200 Mitarbeiter</option>
                <option value="201-500">201-500 Mitarbeiter</option>
                <option value="500+">500+ Mitarbeiter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="ds-label">Gründungsjahr</label>
            <input
              type="number"
              value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              className="ds-input ds-input-focus-green"
              placeholder="z.B. 2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

