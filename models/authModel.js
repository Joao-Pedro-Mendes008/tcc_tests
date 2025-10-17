import supabase from "../connection";

export const signUp = async (
    {
        email,
        password,
        telefone,
        nome_completo,
        funcao
    }
) => {
    const {
        data: createUserData,
        error: createUserError
    } = await supabase.auth.signUp(
        {
            email,
            password,
            phone,
            role: funcao,
            options: {
                emailRedirectTo: "/signIn"
            }
        }
    );
    if (createUserError) {
        console.error(
            "Erro ao criar usuário",
            createUserError.status,
            createUserError.message
        );
        return null
    }
    const {
        data: createPatientData,
        error: createPatientError
    } = await supabase
        .from('pacientes')
        .insert(
            {
                email,
                telefone,
                nome_completo,
                funcao
            }
        )
        .select();
    if (createPatientError) {
        console.error(
            "Erro ao criar paciente",
            createPatientError.status,
            createPatientError.message
        )
    }

    return createUserData;
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

const signUpConsultorio = async (
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