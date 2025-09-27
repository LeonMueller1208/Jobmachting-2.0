"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email) {
      alert("Bitte E-Mail eingeben");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/companies?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data) {
        localStorage.setItem("companySession", JSON.stringify(data));
        router.push("/company");
      } else {
        alert("Unternehmen nicht gefunden. Bitte registrieren Sie sich.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Fehler beim Anmelden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-background min-h-screen">
      <Header title="Unternehmen Anmeldung" showBackButton={true} backHref="/company/choose" />
      
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-green rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-2xl ds-heading mb-2">Anmelden</h1>
            <p className="ds-body-light">Melden Sie sich mit Ihrer Unternehmens-E-Mail an</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="ds-label">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ds-input ds-input-focus-green"
                placeholder="unternehmen@beispiel.de"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full ds-button-primary-green"
            >
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Noch nicht registriert?{" "}
              <a href="/company/register" className="ds-link-green">
                Hier registrieren
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
