"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import StepTransition from "./StepTransition";
import JobStep1Title from "./steps/JobStep1Title";
import JobStep2Description from "./steps/JobStep2Description";
import JobStep3LocationAndType from "./steps/JobStep3LocationAndType";
import JobStep4Experience from "./steps/JobStep4Experience";
import JobStep5Education from "./steps/JobStep5Education";
import JobStep6Skills from "./steps/JobStep6Skills";
import JobStep7Industry from "./steps/JobStep7Industry";
import JobStep7Hierarchy from "./steps/JobStep7Hierarchy";
import JobStep8Autonomy from "./steps/JobStep8Autonomy";
import JobStep9Teamwork from "./steps/JobStep9Teamwork";
import JobStep10WorkStructure from "./steps/JobStep10WorkStructure";
import JobStep11Feedback from "./steps/JobStep11Feedback";
import JobStep12Flexibility from "./steps/JobStep12Flexibility";
import JobStep13Summary from "./steps/JobStep8Summary";

const TOTAL_STEPS = 14;
const DRAFT_KEY = "job_onboarding_draft";

export default function MultiStepJobForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Form Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [requiredEducation, setRequiredEducation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [industry, setIndustry] = useState("");
  const [hierarchy, setHierarchy] = useState<number>(0);
  const [autonomy, setAutonomy] = useState<number>(0);
  const [teamwork, setTeamwork] = useState<number>(0);
  const [workStructure, setWorkStructure] = useState<number>(0);
  const [feedback, setFeedback] = useState<number>(0);
  const [flexibility, setFlexibility] = useState<number>(0);

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
    if (title || description || requiredSkills.length > 0) {
      const draft = {
        title,
        description,
        location,
        jobType,
        minExperience,
        requiredEducation,
        requiredSkills,
        industry,
        hierarchy,
        autonomy,
        teamwork,
        workStructure,
        feedback,
        flexibility,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [title, description, location, jobType, minExperience, requiredEducation, requiredSkills, industry, workValues, teamStyle, workEnvironment, motivation, currentStep]);

  function loadDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      setTitle(parsed.title || "");
      setDescription(parsed.description || "");
      setLocation(parsed.location || "");
      setJobType(parsed.jobType || "");
      setMinExperience(parsed.minExperience || 0);
      setRequiredEducation(parsed.requiredEducation || "");
      setRequiredSkills(parsed.requiredSkills || []);
      setIndustry(parsed.industry || "");
      setHierarchy(parsed.hierarchy || 0);
      setAutonomy(parsed.autonomy || 0);
      setTeamwork(parsed.teamwork || 0);
      setWorkStructure(parsed.workStructure || 0);
      setFeedback(parsed.feedback || 0);
      setFlexibility(parsed.flexibility || 0);
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
    if (currentStep === 1 && !title) {
      alert("Bitte Stellentitel eingeben");
      return;
    }
    if (currentStep === 2 && description.length < 50) {
      alert("Bitte eine aussagekräftige Beschreibung eingeben (mind. 50 Zeichen)");
      return;
    }
    if (currentStep === 3 && (!location || !jobType)) {
      alert("Bitte Standort und Beschäftigungsart wählen");
      return;
    }
    if (currentStep === 6 && requiredSkills.length === 0) {
      alert("Bitte mindestens 1 Skill auswählen");
      return;
    }
    if (currentStep === 8 && !hierarchy) {
      alert("Bitte eine Hierarchie-Option auswählen");
      return;
    }
    if (currentStep === 9 && !autonomy) {
      alert("Bitte eine Autonomie-Option auswählen");
      return;
    }
    if (currentStep === 10 && !teamwork) {
      alert("Bitte eine Teamarbeit-Option auswählen");
      return;
    }
    if (currentStep === 11 && !workStructure) {
      alert("Bitte eine Bewertung für Arbeitsstruktur auswählen");
      return;
    }
    if (currentStep === 12 && !feedback) {
      alert("Bitte eine Bewertung für Feedback auswählen");
      return;
    }
    if (currentStep === 13 && !flexibility) {
      alert("Bitte eine Flexibilität-Option auswählen");
      return;
    }

    setDirection('forward');
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setDirection('back');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }

  function skipStep() {
    setDirection('forward');
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }

  function goToStep(step: number) {
    setDirection(step > currentStep ? 'forward' : 'back');
    setCurrentStep(step);
  }

  async function handleSubmit() {
    if (!title || !description || requiredSkills.length === 0 || !location || !hierarchy || !autonomy || !teamwork || !workStructure || !feedback || !flexibility) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen");
      setShowError(true);
      return;
    }

    const companySession = localStorage.getItem("companySession");
    if (!companySession) {
      setErrorMessage("Bitte melden Sie sich an");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const company = JSON.parse(companySession);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
          location,
          minExperience,
          requiredEducation,
          jobType,
          industry,
          hierarchy,
          autonomy,
          teamwork,
          workStructure,
          feedback,
          flexibility,
          companyId: company.id,
        }),
      });

      if (res.ok) {
        localStorage.removeItem(DRAFT_KEY);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/company");
        }, 2000);
      } else {
        const error = await res.json();
        setErrorMessage(error.error || "Unbekannter Fehler");
        setShowError(true);
      }
    } catch (error) {
      console.error("Job creation error:", error);
      setErrorMessage(`Fehler beim Erstellen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }

  const formData = {
    title,
    description,
    location,
    jobType,
    minExperience,
    requiredEducation,
    requiredSkills,
    industry,
    hierarchy,
    autonomy,
    teamwork,
    workStructure,
    feedback,
    flexibility
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-6 sm:p-8">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Step Content */}
          <StepTransition direction={direction}>
            {currentStep === 1 && (
              <JobStep1Title title={title} setTitle={setTitle} />
            )}
            {currentStep === 2 && (
              <JobStep2Description description={description} setDescription={setDescription} />
            )}
            {currentStep === 3 && (
              <JobStep3LocationAndType 
                location={location} 
                jobType={jobType} 
                setLocation={setLocation} 
                setJobType={setJobType} 
              />
            )}
            {currentStep === 4 && (
              <JobStep4Experience minExperience={minExperience} setMinExperience={setMinExperience} />
            )}
            {currentStep === 5 && (
              <JobStep5Education 
                requiredEducation={requiredEducation} 
                setRequiredEducation={setRequiredEducation} 
                onSkip={skipStep} 
              />
            )}
            {currentStep === 6 && (
              <JobStep6Skills requiredSkills={requiredSkills} setRequiredSkills={setRequiredSkills} />
            )}
            {currentStep === 7 && (
              <JobStep7Industry industry={industry} setIndustry={setIndustry} onSkip={skipStep} />
            )}
            {currentStep === 8 && (
              <JobStep7Hierarchy hierarchy={hierarchy} setHierarchy={setHierarchy} />
            )}
            {currentStep === 9 && (
              <JobStep8Autonomy autonomy={autonomy} setAutonomy={setAutonomy} />
            )}
            {currentStep === 10 && (
              <JobStep9Teamwork teamwork={teamwork} setTeamwork={setTeamwork} />
            )}
            {currentStep === 11 && (
              <JobStep10WorkStructure workStructure={workStructure} setWorkStructure={setWorkStructure} />
            )}
            {currentStep === 12 && (
              <JobStep11Feedback feedback={feedback} setFeedback={setFeedback} />
            )}
            {currentStep === 13 && (
              <JobStep12Flexibility flexibility={flexibility} setFlexibility={setFlexibility} />
            )}
            {currentStep === 14 && (
              <JobStep13Summary formData={formData} onEdit={goToStep} />
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
                {loading ? "Erstelle Stelle..." : "🚀 Stelle veröffentlichen"}
              </button>
            )}
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
              Sie haben eine unvollständige Stellenausschreibung. Möchten Sie fortfahren oder neu starten?
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 ds-icon-container-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Stelle erfolgreich erstellt!</h2>
            <p className="ds-body-light mb-6">Sie werden automatisch zum Dashboard weitergeleitet...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[var(--accent-green)] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="ds-card p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Fehler beim Erstellen</h2>
            <p className="ds-body-light mb-6">{errorMessage}</p>
            <button 
              onClick={() => setShowError(false)}
              className="ds-button-primary-green"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}
    </>
  );
}

