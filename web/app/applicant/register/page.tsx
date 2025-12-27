"use client";

import Header from "@/components/Header";
import MultiStepApplicantForm from "@/components/onboarding/MultiStepApplicantForm";

export default function ApplicantRegister() {
  return (
    <div className="ds-background min-h-screen">
      <Header title="Bewerber Registrierung" showBackButton={true} backHref="/applicant/choose" />
      <main>
        <MultiStepApplicantForm />
      </main>
    </div>
  );
}
