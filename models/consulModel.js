import supabase from "../connection";

const listPatient = async (id) => {
    const { data, error } = await supabase
        .from('consultas')
        .select()
        .eq('id', `${id}`)
};

const addConsulta = async ({ id, nomePaciente, desc, date }) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('pacientes')
            .select()
            .eq('name', `${nomePaciente}`);
        if (userError) {
            console.error(
                "Paciente não encontrado",
                userError.message
            )
            return { user: null };
        }

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert(
                {
                    id_consultorio: id,
                    id_paciente: user.id,
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