import { get_institute_data_in_mem } from "@/utils/domain-handlers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {id: string}}){

    const result = get_institute_data_in_mem("https://openalex.org/" + params.id)

    if (!result) {
        return new NextResponse(JSON.stringify({ error: 'Institute not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(result), { status: 200 });
}
