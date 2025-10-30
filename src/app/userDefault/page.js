"use client";

import { useContext, useEffect, useState } from "react";
import { sessionContext } from "@/context/userContext";
import { listConsultasPaciente } from "../../../api/user";
import "./userDefault.css";
import Head from "next/head";

export default function UserHome() {
  const { session } = useContext(sessionContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(session);
 useEffect(() => {
    let mounted = true;

    const fetchConsultas = async () => {
      if (!session?.user?.id) {
        if (mounted) setLoading(false);
        return;
      }

      const { consultas, error } = await listConsultasPaciente(session.user.id);
      if (!mounted) return;

      if (!error) {
        setConsultas(consultas ?? []);
      } else {
        console.error("Erro ao buscar consultas:", error);
      }

      setLoading(false);
    };

    fetchConsultas();

    return () => {
      mounted = false;
    };
  }, [session]);

  if (loading) return <p>Carregando consultas...</p>;

  return (
    <>
      <Head>
        <title>Minhas Consultas</title>
      </Head>

      <div className="container">
        <h1 className="primaryText">Próximas Consultas</h1>

        {consultas.length === 0 ? (
          <p>Você não possui consultas agendadas.</p>
        ) : (
          consultas.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: "#fff",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "10px",
              }}
            >
              <p><strong>Descrição:</strong> {c.desc}</p>
              <p><strong>Data:</strong> {new Date(c.horario_marcado).toLocaleString()}</p>
              {c.consultorios?.nome && (
                <p><strong>Consultório:</strong> {c.consultorios.nome}</p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
