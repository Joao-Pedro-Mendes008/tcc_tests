import supabase from "../connection";

const listPatient = async (id) => {
    const {data, error} = await supabase
    .from('consultas')
    .select()
    .eq('id', `${id}`)
};
