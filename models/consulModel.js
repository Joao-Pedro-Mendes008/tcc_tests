import supabase from "../connection";

const listPatient = async (id) => {
    const { data, error } = await supabase
        .from('consultas')
        .select()
        .eq('id', `${id}`)
};

const getPacient = async ({ nomePaciente, telefone, desc, date }) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('pacientes')
            .select('id, nome_completo, telefone')
            .eq('nome_completo', nomePaciente)
            .eq('telefone', telefone,);
        if (!user || user.length === 0) {
            console.log('Erro ao buscar paciente' + userError.message)
            return ({ user: null })
        }
        const usuarios = Object.fromEntries(user.map(p => [p.id, p]))
        return { user: usuarios, userError: null }
    } catch (error) {

    }
};

const addConsulta = async ({ id, idPaciente, telefone, desc, date }) => {
    try {
        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert(
                {
                    id_consultorio: id,
                    id_paciente: idPaciente,
                    desc,
                    horario_marcado: date
                }
            )
            .select();
        if (consultaError) {
            console.error(
                'Erro ao criar consulta', consultaError.message
            )
            return { consulta: null }
        }

        return consulta
    } catch (error) {

    }
}