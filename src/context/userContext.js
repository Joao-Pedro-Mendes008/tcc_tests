'use client'
import { useContext, createContext, useEffect, useState } from "react";
import supabase from "../../connection";

export const sessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user) {
        await fetchUserRole(data.session.user.email);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserRole(session.user.email);
        } else {
          setUserRole(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);


  const fetchUserRole = async (email) => {

    const { data: paciente } = await supabase
      .from("pacientes")
      .select("role")
      .eq("email", email)
      .maybeSingle();

    if (paciente?.role) {
      setUserRole(paciente.role);
      return;
    }


    const { data: consultorio } = await supabase
      .from("consultorios")
      .select("role")
      .eq("email", email)
      .maybeSingle();

    if (consultorio?.role) {
      setUserRole(consultorio.role);
    }
  };

  return (
    <sessionContext.Provider value={{ session, setSession, userRole }}>
      {children}
    </sessionContext.Provider>
  );
}

export const useSession = () => useContext(sessionContext);