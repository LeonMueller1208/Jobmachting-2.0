"use client";

interface CompanyStep4SummaryProps {
  formData: {
    name: string;
    email: string;
    industry: string;
    location: string;
    description?: string;
    website?: string;
    companySize?: string;
    foundedYear?: string;
  };
  onEdit: (step: number) => void;
}

export default function CompanyStep4Summary({ formData, onEdit }: CompanyStep4SummaryProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 ds-icon-container-green rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-3">Perfekt! 🎉</h2>
        <p className="ds-body-light text-base sm:text-lg">Überprüfen Sie Ihre Unternehmensdaten</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Basics */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🏢 Unternehmensdaten</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Name:</span> {formData.name}</p>
            <p><span className="font-medium text-gray-600">E-Mail:</span> {formData.email}</p>
          </div>
        </div>

        {/* Industry & Location */}
        <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">🏭 Branche & Standort</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Bearbeiten
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Branche:</span> {formData.industry}</p>
            <p><span className="font-medium text-gray-600">Standort:</span> {formData.location}</p>
          </div>
        </div>

        {/* Optional Company Info */}
        {(formData.description || formData.website || formData.companySize || formData.foundedYear) && (
          <div className="ds-card p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">ℹ️ Zusätzliche Informationen</h3>
              <button
                onClick={() => onEdit(3)}
                className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Bearbeiten
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {formData.description && (
                <p><span className="font-medium text-gray-600">Beschreibung:</span> {formData.description.substring(0, 100)}{formData.description.length > 100 ? '...' : ''}</p>
              )}
              {formData.website && (
                <p><span className="font-medium text-gray-600">Website:</span> {formData.website}</p>
              )}
              {formData.companySize && (
                <p><span className="font-medium text-gray-600">Größe:</span> {formData.companySize}</p>
              )}
              {formData.foundedYear && (
                <p><span className="font-medium text-gray-600">Gründungsjahr:</span> {formData.foundedYear}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Alles bereit!</h4>
            <p className="text-sm text-green-800">
              Ihr Unternehmensprofil ist vollständig. Nach der Registrierung können Sie direkt Stellen ausschreiben! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

