"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function ApplicantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      alert("Bitte E-Mail und Passwort eingeben");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/applicants/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data) {
        localStorage.setItem("applicantSession", JSON.stringify(data));
        router.push("/applicant");
      } else {
        alert(data.error || "Ungültige E-Mail oder Passwort");
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
      <Header title="Bewerber Anmeldung" showBackButton={true} backHref="/applicant" />
      
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="ds-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ds-icon-container-blue rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl ds-heading mb-2">Anmelden</h1>
            <p className="ds-body-light text-sm sm:text-base lg:text-lg">Melden Sie sich mit Ihrer E-Mail an</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="ds-label">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ds-input ds-input-focus-blue"
                placeholder="ihre.email@beispiel.de"
              />
            </div>

            <div>
              <label className="ds-label">Passwort</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ds-input ds-input-focus-blue pr-10"
                  placeholder="Ihr Passwort"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full ds-button-primary-blue"
            >
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="ds-body-light text-sm">
              Noch kein Konto?{" "}
              <span className="text-gray-500">
                Registrierung erfolgt automatisch bei Interaktion mit Stellen
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
