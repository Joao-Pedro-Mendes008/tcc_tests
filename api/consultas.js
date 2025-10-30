import supabase from "../connection";

const listPatient = async (id) => {
  try {
    const { data, error } = await supabase
      .from('consultas')
      .select()
      .eq('id_consultorio', id)
      .order('horario_marcado', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro em listPatient:', err.message);
    return { data: null, error: err };
  }
};

const getPacient = async ({ nomePaciente, telefone }) => {
  try {
    const { data: user, error } = await supabase
      .from('pacientes')
      .select('id, nome_completo, telefone')
      .eq('nome_completo', nomePaciente)
      .eq('telefone', telefone);

    if (error) throw error;
    if (!user || user.length === 0) {
      console.warn('Nenhum paciente encontrado');
      return { user: null, error: null };
    }

    return { user, error: null };
  } catch (err) {
    console.error('Erro ao buscar paciente:', err.message);
    return { user: null, error: err };
  }
};

const addConsulta = async ({ id, idPaciente, desc, date }) => {
  try {
    const { data: consulta, error } = await supabase
      .from('consultas')
      .insert({
        id_consultorio: id,
        id_paciente: idPaciente,
        desc,
        horario_marcado: date,
      })
      .select();

    if (error) throw error;

    return { consulta, error: null };
  } catch (err) {
    console.error('Erro ao criar consulta:', err.message);
    return { consulta: null, error: err };
  }
};

const addConsultaByPaciente = async ({ idConsultorio, nomePaciente, telefone, desc, date }) => {
  try {
    const { data: paciente, error: pacienteError } = await supabase
      .from("usuarios")
      .select("id, nome_completo, telefone")
      .eq("nome_completo", nomePaciente)
      .eq("telefone", telefone)
      .single();

    if (pacienteError || !paciente) {
      return { consulta: null, error: pacienteError || new Error("Paciente não encontrado") };
    }

    const { data: consulta, error: consultaError } = await supabase
      .from("consultas")
      .insert({
        id_consultorio: idConsultorio,
        id_paciente: paciente.id,
        desc,
        horario_marcado: date
      })
      .select()
      .single();

    if (consultaError) throw consultaError;

    return { consulta, error: null };
  } catch (err) {
    return { consulta: null, error: err };
  }
};

export { listPatient, getPacient, addConsulta, addConsultaByPaciente };