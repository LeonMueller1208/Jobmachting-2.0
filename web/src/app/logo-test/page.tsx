"use client";

import Logo from "@/components/Logo";

export default function LogoTest() {
  return (
    <div className="ds-background min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl ds-heading mb-8 text-center">Talentsync Logo Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Standard */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Standard</h3>
            <Logo size="lg" variant="default" />
          </div>

          {/* Gradient */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Gradient</h3>
            <Logo size="lg" variant="gradient" />
          </div>

          {/* Minimal */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Minimal</h3>
            <Logo size="lg" variant="minimal" />
          </div>

          {/* Verschiedene Größen */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Größen</h3>
            <div className="space-y-4">
              <Logo size="sm" variant="gradient" />
              <Logo size="md" variant="gradient" />
              <Logo size="lg" variant="gradient" />
            </div>
          </div>

          {/* Header Style */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Header Style</h3>
            <Logo size="md" variant="gradient" className="justify-center" />
          </div>

          {/* Footer Style */}
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg ds-subheading mb-4">Footer Style</h3>
            <Logo size="sm" variant="minimal" className="justify-center" />
          </div>
        </div>

        <div className="mt-12 ds-card p-6">
          <h2 className="text-xl ds-subheading mb-4">Verwendung in Code:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Verschiedene Varianten
<Logo variant="default" />   // Standard Schrift
<Logo variant="gradient" />   // Gradient Blau-Grün
<Logo variant="minimal" />    // Minimalistisch

// Verschiedene Größen
<Logo size="sm" />   // Klein (text-2xl)
<Logo size="md" />   // Mittel (text-3xl)
<Logo size="lg" />   // Groß (text-4xl)

// Mit zusätzlichen Klassen
<Logo className="justify-center" />
<Logo className="text-center" />`}
          </pre>
        </div>
      </div>
    </div>
  );
}
