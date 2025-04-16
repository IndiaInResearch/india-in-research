import { get_institute_data_in_mem } from "@/utils/domain-handlers";
import { supabaseClient } from "@/utils/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {id: string}}){

    const { data, error } = await supabaseClient.from('institutes').select('*').eq('openalex_id', "https://openalex.org/" + params.id).limit(1)

    if (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (!data || data.length == 0) {
        return new NextResponse(JSON.stringify({ error: 'Institute not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(data[0]), { status: 200 });
}
