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
}) => {
    try {

        const { data: createUserData, error: createUserError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "/signIn",
                data: {
                    role: "paciente"
                }
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
    try {
        if (!email || !password) {
            return { user: null, error: new Error("Credenciais faltando") };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error("Erro ao logar o usuário", error.status, error.message);
            return { user: null, error };
        }

        return { user: data?.user ?? null, error: null };
    } catch (err) {
        console.error("Erro inesperado em signIn:", err);
        return { user: null, error: err };
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
    // Cria o usuário no supabase (autenticação) com role "consultorio"
    const {
        data: createConsultorio,
        error: createConsultorioError,
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: "/signInConsultorio",
            data: { role: "consultorio" },
        },
    });

    if (createConsultorioError) {
        console.error("Erro ao cadastrar consult\u00f3rio:", createConsultorioError);
        return null;
    }

    // Insere dados adicionais na tabela de consultorios
    const {
        data: createConsultorioData,
        error: createConsultorioDataError,
    } = await supabase
        .from("consultorios")
        .insert({
            email,
            telefone,
            nome,
            endereco,
            cnpj,
        })
        .select();

    if (createConsultorioDataError) {
        console.error("Erro ao cadastrar consult\u00f3rio (dados):", createConsultorioDataError);
    }

    return createConsultorio;
}

export const listConsultasPaciente = async (pacienteId) => {
    try {
        const { data: consultas, error } = await supabase
            .from("consultas")
            .select(`
        id,
        desc,
        horario_marcado,
        consultorios (
          id,
          nome,
          endereco,
          telefone
        )
      `)
            .eq("id_paciente", pacienteId)
            .order("horario_marcado", { ascending: false });

        if (error) throw error;

        return { consultas, error: null };
    } catch (err) {
        return { consultas: null, error: err };
    }
};

