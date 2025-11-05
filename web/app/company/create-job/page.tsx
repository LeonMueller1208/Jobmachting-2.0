"use client";

import Header from "@/components/Header";
import MultiStepJobForm from "@/components/onboarding/MultiStepJobForm";

export default function CreateJob() {
  return (
    <div className="ds-background min-h-screen">
      <Header title="Stelle erstellen" showBackButton={true} backHref="/company" />
      <main>
        <MultiStepJobForm />
      </main>
    </div>
  );
}
