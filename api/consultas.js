import supabase from "../connection";

const listPatient = async (id) => {
    const { data, error } = await supabase
        .from('consultas')
        .select()
        .eq('id', id)
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

export { listPatient, getPacient, addConsulta };