"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/userContext";

export function ProtectedRoute({ role, children }) {
  const { session, userRole } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && userRole && userRole !== role) {
      router.push("/"); 
    }
    if (session === null && userRole === null) {
      router.push("/"); 
    }
  }, [session, userRole, role, router]);

  if (!session) return <p>Carregando...</p>;
  return children;
}
