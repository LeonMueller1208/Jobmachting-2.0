"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyChoose() {
  const router = useRouter();
  
  useEffect(() => {
    // Direkt zum Dashboard weiterleiten - User kann ohne Login browsen
    router.push("/company");
  }, [router]);

  return null;
}
