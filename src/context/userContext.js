'use client'
import { useContext, createContext, useEffect, useState } from "react";
import supabase from "../../connection";

export const sessionContext = createContext(null);

export function SessionProvider({ children }) {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);
    return (
        <sessionContext.Provider value={{session, setSession}}>
            {children}
        </sessionContext.Provider>
    )
};