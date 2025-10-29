'use client';
import { ProtectedRoute } from "@/components/protectedRoute";
import { SessionProvider } from "@/context/userContext";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  let role = null;
  if (pathname.startsWith("/consulDefault")) role = "consultorio";
  if (pathname.startsWith("/userDefault")) role = "paciente";

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/signIn") ||
    pathname.startsWith("/signUp") ||
    pathname.startsWith("/verify");

  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          {isPublic ? (
            children
          ) : role ? (
            <ProtectedRoute role={role}>{children}</ProtectedRoute>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}


