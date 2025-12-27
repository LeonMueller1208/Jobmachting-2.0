"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import StepTransition from "./StepTransition";
import CompanyStep1Basics from "./steps/CompanyStep1Basics";
import CompanyStep2Industry from "./steps/CompanyStep2Industry";
import CompanyStep3Location from "./steps/CompanyStep3Location";
import CompanyStep4Summary from "./steps/CompanyStep4Summary";
import CompanyStep5EmailPassword from "./steps/CompanyStep5EmailPassword";

const TOTAL_STEPS = 5;
const DRAFT_KEY = "company_onboarding_draft";

export default function MultiStepCompanyForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [loading, setLoading] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const draftAge = Date.now() - (parsed.timestamp || 0);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (draftAge < sevenDays) {
          setShowDraftModal(true);
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch (e) {
        console.error("Failed to parse draft:", e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Auto-save to localStorage
  useEffect(() => {
    if (name || email || industry || location) {
      const draft = {
        name,
        email,
        industry,
        location,
        description,
        website,
        companySize,
        foundedYear,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [name, email, industry, location, description, website, companySize, foundedYear, currentStep]);

  function loadDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setIndustry(parsed.industry || "");
      setLocation(parsed.location || "");
      setDescription(parsed.description || "");
      setWebsite(parsed.website || "");
      setCompanySize(parsed.companySize || "");
      setFoundedYear(parsed.foundedYear || "");
      setCurrentStep(parsed.currentStep || 1);
    }
    setShowDraftModal(false);
  }

  function discardDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftModal(false);
  }

  function nextStep() {
    // Validation per step
    if (currentStep === 1) {
      if (!name) {
        alert("Bitte geben Sie den Unternehmensnamen ein");
        return;
      }
    }
    if (currentStep === 5) {
      if (!email) {
        alert("Bitte geben Sie die E-Mail-Adresse ein");
        return;
      }
      if (!password || password.length < 8) {
        alert("Bitte ein Passwort mit mindestens 8 Zeichen eingeben");
        return;
      }
      if (password !== passwordConfirm) {
        alert("Die Passwörter stimmen nicht überein");
        return;
      }
    }
    if (currentStep === 2 && !industry) {
      alert("Bitte Branche wählen");
      return;
    }
    if (currentStep === 3 && !location) {
      alert("Bitte Standort wählen");
      return;
    }

    setDirection('forward');
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setDirection('back');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }

  function goToStep(step: number) {
    setDirection(step > currentStep ? 'forward' : 'back');
    setCurrentStep(step);
  }

  async function handleSubmit() {
    if (!name || !industry || !location) {
      alert("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          // email and password will be set later when user interacts
          industry, 
          location,
          description: description || null,
          website: website || null,
          companySize: companySize || null,
          foundedYear: foundedYear ? parseInt(foundedYear) : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("companySession", JSON.stringify(data));
        localStorage.removeItem(DRAFT_KEY);
        localStorage.setItem("company_welcome_shown", "pending"); // Trigger welcome modal on first dashboard visit
        alert("Unternehmen erfolgreich registriert! Sie können jetzt Stellen erstellen. Bei Interaktion wird E-Mail und Passwort abgefragt.");
        router.push("/company");
      } else {
        const error = await res.json();
        alert(`Fehler: ${error.error || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Fehler bei der Registrierung");
    } finally {
      setLoading(false);
    }
  }

  const formData = { name, email, industry, location, description, website, companySize, foundedYear };

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-6 sm:p-8">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Step Content */}
          <StepTransition direction={direction}>
            {currentStep === 1 && (
              <CompanyStep1Basics 
                name={name} 
                setName={setName} 
              />
            )}
            {currentStep === 2 && (
              <CompanyStep2Industry industry={industry} setIndustry={setIndustry} />
            )}
            {currentStep === 3 && (
              <CompanyStep3Location 
                location={location} 
                setLocation={setLocation}
                description={description}
                setDescription={setDescription}
                website={website}
                setWebsite={setWebsite}
                companySize={companySize}
                setCompanySize={setCompanySize}
                foundedYear={foundedYear}
                setFoundedYear={setFoundedYear}
              />
            )}
            {currentStep === 4 && (
              <CompanyStep4Summary formData={formData} onEdit={goToStep} />
            )}
            {currentStep === 5 && (
              <CompanyStep5EmailPassword
                email={email}
                password={password}
                passwordConfirm={passwordConfirm}
                setEmail={setEmail}
                setPassword={setPassword}
                setPasswordConfirm={setPasswordConfirm}
              />
            )}
          </StepTransition>

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-[var(--border-radius-button)] transition-all duration-300 disabled:opacity-50"
              >
                ← Zurück
              </button>
            )}
            
            {currentStep < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                disabled={loading}
                className="flex-1 ds-button-primary-green"
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 ds-button-primary-green text-lg py-4"
              >
                {loading ? "Registriere Unternehmen..." : "🚀 Unternehmen registrieren"}
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Bereits registriert?{" "}
              <a href="/company/login" className="ds-link-green">
                Hier anmelden
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Draft Recovery Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Entwurf gefunden! 📝</h2>
            <p className="ds-body-light mb-6">
              Sie haben eine unvollständige Registrierung. Möchten Sie fortfahren oder neu starten?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={discardDraft}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-[var(--border-radius-button)] transition-all duration-300"
              >
                Neu starten
              </button>
              <button 
                onClick={loadDraft}
                className="flex-1 ds-button-primary-green"
              >
                Fortfahren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

