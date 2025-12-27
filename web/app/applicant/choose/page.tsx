"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantChoose() {
  const router = useRouter();
  
  useEffect(() => {
    // Direkt zum Dashboard weiterleiten - User kann ohne Login browsen
    router.push("/applicant");
  }, [router]);

  return null;
}
