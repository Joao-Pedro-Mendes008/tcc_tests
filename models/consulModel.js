import supabase from "../connection";

const listPatient = async (idConsutltorio) => {
    const {data, error} = await supabase
    .from('consultas')
    .select()
}