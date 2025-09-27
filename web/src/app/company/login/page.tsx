"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      if (!res.ok) {
        if (res.status === 404) {
          alert("Kein Konto mit dieser E-Mail gefunden. Bitte registrieren Sie sich zuerst.");
          return;
        }
        throw new Error("Login fehlgeschlagen");
      }
      
      const company = await res.json();
      localStorage.setItem("companySession", JSON.stringify(company));
      router.push("/company");
    } catch (error) {
      console.error("Login error:", error);
      alert(`Fehler beim Anmelden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="text-center mb-8">
          <Link href="/company/choose" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-600">Als Unternehmen anmelden</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="firma@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Anmelden..." : "Anmelden"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Noch kein Konto?{" "}
                <Link href="/company/register" className="text-green-600 hover:text-green-700 font-medium">
                  Registrieren
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

