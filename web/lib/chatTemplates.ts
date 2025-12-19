/**
 * Utility functions for chat templates
 */

export type PlaceholderData = {
  applicantName: string;
  jobTitle: string;
  companyName: string;
  applicantEmail?: string;
};

/**
 * Available placeholders that can be used in templates
 */
export const AVAILABLE_PLACEHOLDERS = [
  { key: '{applicantName}', label: 'Bewerbername', description: 'Name des Bewerbers' },
  { key: '{jobTitle}', label: 'Stellentitel', description: 'Titel der Stelle' },
  { key: '{companyName}', label: 'Firmenname', description: 'Name Ihrer Firma' },
  { key: '{applicantEmail}', label: 'E-Mail', description: 'E-Mail-Adresse des Bewerbers' },
] as const;

/**
 * Replaces placeholders in a template string with actual values
 */
export function replacePlaceholders(
  template: string,
  data: PlaceholderData
): string {
  let result = template;
  
  result = result.replace(/{applicantName}/g, data.applicantName);
  result = result.replace(/{jobTitle}/g, data.jobTitle);
  result = result.replace(/{companyName}/g, data.companyName);
  
  if (data.applicantEmail) {
    result = result.replace(/{applicantEmail}/g, data.applicantEmail);
  } else {
    // Remove placeholder if email is not available
    result = result.replace(/{applicantEmail}/g, '');
  }
  
  return result;
}

/**
 * Default templates that are created for each company
 */
export const DEFAULT_TEMPLATES = [
  {
    name: 'Erstkontakt',
    content: `Hallo {applicantName},

vielen Dank für Ihr Interesse an der Stelle "{jobTitle}" bei {companyName}.
Wir melden uns in Kürze bei Ihnen.

Mit freundlichen Grüßen`,
    isDefault: true,
  },
  {
    name: 'Einladung zum Interview',
    content: `Sehr geehrte/r {applicantName},

wir würden Sie gerne zum Vorstellungsgespräch für die Position "{jobTitle}" einladen.
Bitte teilen Sie uns Ihre Verfügbarkeit mit.

Beste Grüße
{companyName}`,
    isDefault: true,
  },
] as const;

