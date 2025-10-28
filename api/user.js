import supabase from "../connection";

export const signUp = async ({
    email,
    password,
    nome,
    telefone,
    data_nascimento,
    cpf,
    genero,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    funcao
}) => {
    try {

        const { data: createUserData, error: createUserError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "/signIn"
            }
        });

        if (createUserError) {
            console.error("Erro ao criar usuário:", createUserError.status, createUserError.message);
            return null;
        }


        const { data: createPatientData, error: createPatientError } = await supabase
            .from("pacientes")
            .insert({
                email,
                telefone,
                nome_completo: nome,
                data_nascimento,
                cpf,
                genero,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                funcao
            })
            .select();

        if (createPatientError) {
            console.error(
                "Erro ao criar paciente:",
                createPatientError.status,
                createPatientError.message
            );
            return null;
        }

        return createUserData;

    } catch (error) {
        console.error("Erro inesperado ao criar usuário:", error.message);
        return null;
    }
};


export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword(
        email,
        password
    )
    if (error) {
        console.error(
            "erro ao logar o usuário",
            error.status,
            error.message
        )
    }
};

export const signUpConsultorio = async (
    {
        email,
        password,
        telefone,
        nome,
        endereco,
        cnpj,
    }
) => {
    const {
        data: createConsultorio,
        error: createConsultorioError
    } = await supabase.auth.signUp(
        {
            email,
            password,
            phone,
            role: funcao,
            options: {
                emailRedirectTo: "/signInConsultorio"
            }
        }
    )
    if (createConsultorioError) {
        console.error(
            "Erro ao cadastrar consultório",
            createUserError.status,
            createUserError.message
        );
        return null
    }
    const {
        data: createConsultorioData,
        error: createConsultorioDataError
    } = await supabase
        .from('pacientes')
        .insert(
            {
                email,
                password,
                telefone,
                nome,
                endereco,
                cnpj,
            }
        )
        .select();
    if (createConsultorioDataError) {
        console.error(
            "Erro ao cadastrar consultório",
            createPatientError.status,
            createPatientError.message
        )
    }

    return createUserData;
}

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
      .from('pacientes')
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