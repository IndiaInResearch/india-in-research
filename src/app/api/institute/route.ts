import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    console.log("request recv")
    return new NextResponse()
}
