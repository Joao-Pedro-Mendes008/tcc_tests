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
            .from("usuarios")
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
                funcao: "paciente"
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Erro ao logar o usuário", error.status, error.message);
    return { user: null, error };
  }

  return { user: data.user, error: null };
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
        .from('consultorios')
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

