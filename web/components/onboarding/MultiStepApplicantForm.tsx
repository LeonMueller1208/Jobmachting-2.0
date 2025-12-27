"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import StepTransition from "./StepTransition";
import Step1Basics from "./steps/Step1Basics";
import Step2Location from "./steps/Step2Location";
import Step3Experience from "./steps/Step3Experience";
import Step4Education from "./steps/Step4Education";
import Step5Skills from "./steps/Step5Skills";
import Step6Industry from "./steps/Step6Industry";
import Step7Hierarchy from "./steps/Step7Hierarchy";
import Step8Autonomy from "./steps/Step8Autonomy";
import Step9Teamwork from "./steps/Step9Teamwork";
import Step10WorkStructure from "./steps/Step10WorkStructure";
import Step11Feedback from "./steps/Step11Feedback";
import Step12Flexibility from "./steps/Step12Flexibility";
import Step13Bio from "./steps/Step7Bio";
import Step14Summary from "./steps/Step8Summary";

const TOTAL_STEPS = 14;
const DRAFT_KEY = "applicant_onboarding_draft";

export default function MultiStepApplicantForm() {
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
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [industry, setIndustry] = useState("");
  const [hierarchy, setHierarchy] = useState<number>(0);
  const [autonomy, setAutonomy] = useState<number>(0);
  const [teamwork, setTeamwork] = useState<number>(0);
  const [workStructure, setWorkStructure] = useState<number>(0);
  const [feedback, setFeedback] = useState<number>(0);
  const [flexibility, setFlexibility] = useState<number>(0);
  const [bio, setBio] = useState("");

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
        // Check if draft is recent (within 7 days)
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

  // Auto-save to localStorage on every change (don't save passwords for security)
  useEffect(() => {
    if (name || email || location || skills.length > 0) {
      const draft = {
        name,
        email,
        location,
        experience,
        education,
        skills,
        industry,
        hierarchy,
        autonomy,
        teamwork,
        workStructure,
        feedback,
        flexibility,
        bio,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [name, email, location, experience, education, skills, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility, bio, currentStep]);

  function loadDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setLocation(parsed.location || "");
      setExperience(parsed.experience || 0);
      setEducation(parsed.education || "");
      setSkills(parsed.skills || []);
      setIndustry(parsed.industry || "");
      setHierarchy(parsed.hierarchy || 0);
      setAutonomy(parsed.autonomy || 0);
      setTeamwork(parsed.teamwork || 0);
      setWorkStructure(parsed.workStructure || 0);
      setFeedback(parsed.feedback || 0);
      setFlexibility(parsed.flexibility || 0);
      setBio(parsed.bio || "");
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
        alert("Bitte gib deinen Namen ein");
        return;
      }
    }
    if (currentStep === 14) {
      if (!email) {
        alert("Bitte gib deine E-Mail-Adresse ein");
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
    if (currentStep === 2 && !location) {
      alert("Bitte Standort wählen");
      return;
    }
    if (currentStep === 5 && skills.length === 0) {
      alert("Bitte mindestens 1 Skill auswählen");
      return;
    }
    if (currentStep === 7 && !hierarchy) {
      alert("Bitte eine Hierarchie-Option auswählen");
      return;
    }
    if (currentStep === 8 && !autonomy) {
      alert("Bitte eine Autonomie-Option auswählen");
      return;
    }
    if (currentStep === 9 && !teamwork) {
      alert("Bitte eine Teamarbeit-Option auswählen");
      return;
    }
    if (currentStep === 10 && !workStructure) {
      alert("Bitte eine Bewertung für Arbeitsstruktur auswählen");
      return;
    }
    if (currentStep === 11 && !feedback) {
      alert("Bitte eine Bewertung für Feedback auswählen");
      return;
    }
    if (currentStep === 12 && !flexibility) {
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
    if (!name || skills.length === 0 || !location || !hierarchy || !autonomy || !teamwork || !workStructure || !feedback || !flexibility) {
      alert("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          // email and password will be set later when user interacts
          skills, 
          location, 
          experience, 
          education, 
          bio, 
          industry,
          hierarchy,
          autonomy,
          teamwork,
          workStructure,
          feedback,
          flexibility
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("applicantSession", JSON.stringify(data));
        localStorage.removeItem(DRAFT_KEY); // Clear draft
        localStorage.setItem("applicant_welcome_shown", "pending"); // Trigger welcome modal on first dashboard visit
        alert("Profil erfolgreich erstellt! Sie können jetzt Stellen durchsuchen. Bei Interaktion wird E-Mail und Passwort abgefragt.");
        router.push("/applicant");
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

  const formData = { name, email, location, experience, education, skills, industry, hierarchy, autonomy, teamwork, workStructure, feedback, flexibility, bio };

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="ds-card p-6 sm:p-8">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Step Content */}
          <StepTransition direction={direction}>
            {currentStep === 1 && (
              <Step1Basics 
                name={name} 
                setName={setName} 
              />
            )}
            {currentStep === 2 && (
              <Step2Location location={location} setLocation={setLocation} />
            )}
            {currentStep === 3 && (
              <Step3Experience experience={experience} setExperience={setExperience} />
            )}
            {currentStep === 4 && (
              <Step4Education education={education} setEducation={setEducation} onSkip={skipStep} />
            )}
            {currentStep === 5 && (
              <Step5Skills skills={skills} setSkills={setSkills} />
            )}
            {currentStep === 6 && (
              <Step6Industry industry={industry} setIndustry={setIndustry} onSkip={skipStep} />
            )}
            {currentStep === 7 && (
              <Step7Hierarchy hierarchy={hierarchy} setHierarchy={setHierarchy} />
            )}
            {currentStep === 8 && (
              <Step8Autonomy autonomy={autonomy} setAutonomy={setAutonomy} />
            )}
            {currentStep === 9 && (
              <Step9Teamwork teamwork={teamwork} setTeamwork={setTeamwork} />
            )}
            {currentStep === 10 && (
              <Step10WorkStructure workStructure={workStructure} setWorkStructure={setWorkStructure} />
            )}
            {currentStep === 11 && (
              <Step11Feedback feedback={feedback} setFeedback={setFeedback} />
            )}
            {currentStep === 12 && (
              <Step12Flexibility flexibility={flexibility} setFlexibility={setFlexibility} />
            )}
            {currentStep === 13 && (
              <Step13Bio bio={bio} setBio={setBio} onSkip={skipStep} />
            )}
            {currentStep === 14 && (
              <Step14Summary formData={formData} onEdit={goToStep} />
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
                className="flex-1 ds-button-primary-blue"
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 ds-button-primary-blue text-lg py-4"
              >
                {loading ? "Erstelle Profil..." : "🚀 Profil erstellen"}
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Bereits registriert?{" "}
              <a href="/applicant/login" className="ds-link-blue">
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
            <div className="w-16 h-16 ds-icon-container-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl ds-heading mb-2">Entwurf gefunden! 📝</h2>
            <p className="ds-body-light mb-6">
              Du hast eine unvollständige Registrierung. Möchtest du fortfahren oder neu starten?
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
                className="flex-1 ds-button-primary-blue"
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

