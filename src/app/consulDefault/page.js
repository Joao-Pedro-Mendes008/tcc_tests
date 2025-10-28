'use client';
import { useState, useEffect, useContext } from "react";
import { listPatient, getPacient, addConsulta } from "../../../api/consultas";
import Head from "next/head";
import { sessionContext } from "../../context/userContext";
import "./consulDefault.css";

export default function Consultas() {
  const { session } = useContext(sessionContext);
  const [nomePaciente, setNomePaciente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState("");

  const handleSearchPaciente = async () => {
    setError("");
    const { user, error } = await getPacient({ nomePaciente, telefone });
    if (error) {
      setError("Erro ao buscar paciente");
    } else {
      setPaciente(user ? user[0] : null);
    }
  };

  const handleAddConsulta = async () => {
    if (!paciente) {
      setError("Busque um paciente primeiro!");
      return;
    }

    if (!session || !session.user || !session.user.id_consultorio) {
      setError("Não foi possível identificar o consultório do usuário");
      return;
    }

    const { consulta, error } = await addConsulta({
      id: session.user.id_consultorio,
      idPaciente: paciente.id,
      desc,
      date,
    });

    if (error) {
      setError("Erro ao adicionar consulta");
    } else {
      setConsultas([...consultas, consulta[0]]);
      setDesc("");
      setDate("");
      setError("");
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
        <h1 className="primaryText">Gerenciar Consultas</h1>

        <h3>Buscar Paciente</h3>
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
        <button onClick={handleSearchPaciente}>Buscar</button>

        {paciente && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p>
              <strong>Paciente:</strong> {paciente.nome_completo} -{" "}
              {paciente.telefone}
            </p>
          </div>
        )}

        <h3>Adicionar Consulta</h3>
        <input
          type="datetime-local"
          placeholder="Data e hora"
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

        <h3>Consultas Agendadas</h3>
        <div style={{ width: "90%" }}>
          {consultas.length === 0 && <p>Nenhuma consulta encontrada.</p>}
          {consultas.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>Descrição:</strong> {c.desc}
              </p>
              <p>
                <strong>Horário:</strong>{" "}
                {new Date(c.horario_marcado).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
