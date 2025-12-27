"use client";

import Header from "@/components/Header";
import MultiStepCompanyForm from "@/components/onboarding/MultiStepCompanyForm";

export default function CompanyRegister() {
  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Registrierung" showBackButton={true} backHref="/company/choose" />
      <main>
        <MultiStepCompanyForm />
      </main>
    </div>
  );
}
