'use client';
import { useState, useEffect, useContext } from "react";
import { listPatient } from "../../../api/consultas";
import { addConsultaByPaciente } from "../../../api/consultas"; 
import Head from "next/head";
import { sessionContext } from "../../context/userContext";
import "./consulDefault.css";

export default function Consultas() {
  const { session } = useContext(sessionContext);
  const [nomePaciente, setNomePaciente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddConsulta = async () => {
    setError("");
    setSuccess("");
    if (!nomePaciente || !telefone) {
      setError("Preencha nome e telefone do paciente");
      return;
    }
    if (!session || !session.user || !session.user.id_consultorio) {
      setError("Não foi possível identificar o consultório do usuário");
      return;
    }

    const { consulta, error } = await addConsultaByPaciente({
      idConsultorio: session.user.id_consultorio,
      nomePaciente,
      telefone,
      desc,
      date,
    });

    if (error) {
      setError(error.message || "Erro ao adicionar consulta");
    } else {
      setConsultas([...consultas, consulta]);
      setDesc("");
      setDate("");
      setNomePaciente("");
      setTelefone("");
      setSuccess("Consulta adicionada com sucesso!");
    }
  };

  useEffect(() => {
    const loadConsultas = async () => {
      if (!session || !session.user || !session.user.id_consultorio) return;
      const result = await listPatient(session.user.id_consultorio);
      if (result?.data) setConsultas(result.data);
    };
    loadConsultas();
  }, [session]);

  return (
    <>
      <Head>
        <title>Consultas</title>
      </Head>

      <div className="container">
        <div className="dashboard-header">
          <h1>Gerenciar Consultas</h1>
        </div>

        <div className="section">
          <h2>Adicionar Consulta</h2>
          <input
            type="text"
            placeholder="Nome do paciente"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={handleAddConsulta}>Adicionar Consulta</button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        <div className="section">
          <h2>Consultas Agendadas</h2>
          {consultas.length === 0 && <p>Nenhuma consulta encontrada.</p>}
          {consultas.map((c) => (
            <div key={c.id} className="consulta-card">
              <p><strong>Paciente:</strong> {c.paciente?.nome_completo || c.id_paciente}</p>
              <p><strong>Descrição:</strong> {c.desc}</p>
              <p><strong>Horário:</strong> {new Date(c.horario_marcado).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
