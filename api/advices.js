export const updateAdvices = async (idPaciente, { doencas, medicamentos, outrasObservacoes }) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .update({
        doencas,
        medicamentos,
        outras_observacoes: outrasObservacoes
      })
      .eq('id', idPaciente)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (err) {
    console.error('Erro ao atualizar observações do paciente:', err.message);
    return { data: null, error: err };
  }
};

export const getAdvices = async (idPaciente) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('doencas, medicamentos, outras_observacoes')
      .eq('id', idPaciente)
      .single(); 

    if (error) throw error;

    return { data, error: null };
  } catch (err) {
    console.error('Erro ao buscar observações do paciente:', err.message);
    return { data: null, error: err };
  }
};