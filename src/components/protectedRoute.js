"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/userContext";

export function ProtectedRoute({ role, children }) {
  const { userRole } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (userRole && userRole !== role) {
      router.push("/");
    }
  }, [userRole, role, router]);

  if (!userRole) return <p>Carregando...</p>;
  return children;
}
