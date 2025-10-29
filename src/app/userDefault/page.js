"use client";

import { useContext, useEffect, useState } from "react";
import { sessionContext } from "@/context/userContext";
import { listConsultasPaciente } from "@/../api/consultas";
import "./userDefault.css";
import Head from "next/head";

export default function UserHome() {
  const { session } = useContext(sessionContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultas = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await listConsultasPaciente(session.user.id);
      if (!error) setConsultas(data);
      setLoading(false);
    };
    fetchConsultas();
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
              {c.consultorios?.nome_consultorio && (
                <p><strong>Consultório:</strong> {c.consultorios.nome_consultorio}</p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
