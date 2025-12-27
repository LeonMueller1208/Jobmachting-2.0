"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userType: "applicant" | "company";
  onAuthSuccess: () => void;
  prefillData?: {
    email?: string;
    [key: string]: any;
  };
};

export default function AuthModal({ isOpen, onClose, userType, onAuthSuccess, prefillData }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState(prefillData?.email || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (prefillData?.email) {
      setEmail(prefillData.email);
    }
  }, [prefillData]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setEmail(prefillData?.email || "");
      setPassword("");
      setPasswordConfirm("");
      setError("");
      setMode("login");
    }
  }, [isOpen, prefillData]);

  async function handleLogin() {
    if (!email || !password) {
      setError("Bitte E-Mail und Passwort eingeben");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/${userType === "applicant" ? "applicants" : "companies"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data) {
        localStorage.setItem(`${userType}Session`, JSON.stringify(data));
        onAuthSuccess();
        onClose();
      } else {
        setError(data.error || "Ungültige E-Mail oder Passwort");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Fehler beim Anmelden");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!email || !password || password.length < 8) {
      setError("Bitte E-Mail und ein Passwort mit mindestens 8 Zeichen eingeben");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Check if user already exists
      const checkRes = await fetch(`/api/${userType === "applicant" ? "applicants" : "companies"}?email=${encodeURIComponent(email)}`);
      const existingUser = await checkRes.json();
      
      if (existingUser && existingUser.id) {
        setError("Diese E-Mail ist bereits registriert. Bitte melden Sie sich an.");
        setMode("login");
        return;
      }

      // If we have prefillData, we need to complete registration with password
      // Otherwise, just create account with email and password
      if (prefillData && Object.keys(prefillData).length > 1) {
        // Complete registration with all data
        const res = await fetch(`/api/${userType === "applicant" ? "applicants" : "companies"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prefillData,
            email,
            password,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(`${userType}Session`, JSON.stringify(data));
          localStorage.removeItem(`${userType}Draft`); // Clear draft
          onAuthSuccess();
          onClose();
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Fehler bei der Registrierung");
        }
      } else {
        // Simple registration - just email and password, user will complete profile later
        setError("Bitte vervollständigen Sie zuerst Ihr Profil");
        setMode("login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Fehler bei der Registrierung");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold ds-heading">
              {mode === "login" ? "Anmelden" : "Registrieren"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ihre.email@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder={mode === "login" ? "Ihr Passwort" : "Mindestens 8 Zeichen"}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort bestätigen
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Passwort wiederholen"
                  disabled={loading}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={mode === "login" ? handleLogin : handleRegister}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  userType === "applicant"
                    ? "ds-button-primary-blue"
                    : "ds-button-primary-green"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Wird verarbeitet..." : mode === "login" ? "Anmelden" : "Registrieren"}
              </button>

              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setPassword("");
                  setPasswordConfirm("");
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={loading}
              >
                {mode === "login"
                  ? "Noch kein Konto? Jetzt registrieren"
                  : "Bereits registriert? Jetzt anmelden"}
              </button>
            </div>

            {mode === "register" && prefillData && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <p className="font-medium mb-1">Hinweis:</p>
                <p>Sie haben bereits Profildaten eingegeben. Diese werden mit Ihrem Konto verknüpft.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

