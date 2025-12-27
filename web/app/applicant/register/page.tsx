"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantRegister() {
  const router = useRouter();
  
  useEffect(() => {
    // Weiterleitung zum Dashboard - Registrierung erfolgt über AuthModal bei Interaktion
    router.push("/applicant");
  }, [router]);

  return null;
}
