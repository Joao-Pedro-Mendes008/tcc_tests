'use client'
import { useContext, createContext, useEffect, useState } from "react";
import supabase from "../../connection";

export const sessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);


  const fetchUserRole = async (email) => {
    if (!email) return;
    try {
      const { data: paciente, error: pacienteError } = await supabase
        .from("usuarios")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (pacienteError) throw pacienteError;

      if (paciente?.role) {
        setUserRole(paciente.role);
        return;
      }

      const { data: consultorio, error: consultorioError } = await supabase
        .from("consultorios")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (consultorioError) throw consultorioError;

      if (consultorio?.role) {
        setUserRole(consultorio.role);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error("fetchUserRole error:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("getSession error:", error);
          return;
        }
        setSession(data.session);

        if (data.session?.user?.email) {
          await fetchUserRole(data.session.user.email);
        }
      } catch (err) {
        console.error("getSession catch:", err);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          if (session?.user?.email) {
            await fetchUserRole(session.user.email);
          } else {
            setUserRole(null);
          }
        } catch (err) {
          console.error("onAuthStateChange callback error:", err);
        }
      }
    );

    return () => {
      // Supabase may return { subscription } or the subscription directly
      if (!listener) return;
      if (listener.subscription && typeof listener.subscription.unsubscribe === 'function') {
        listener.subscription.unsubscribe();
      } else if (typeof listener.unsubscribe === 'function') {
        listener.unsubscribe();
      }
    };
  }, []);

  return (
    <sessionContext.Provider value={{ session, setSession, userRole }}>
      {children}
    </sessionContext.Provider>
  );
}

export const useSession = () => useContext(sessionContext);