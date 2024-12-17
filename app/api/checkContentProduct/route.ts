import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:CheckContentProduct = await req.json();
        const response = await fetch(body.content_url);
       
        if(response.ok){
            return NextResponse.json({status: "OK", msg: "Success check content"} as DynamicResult, {status: 200});
        }else{
            return NextResponse.json({status: "Failed", msg: "Content not exists"} as DynamicResult, {status: 404});
        }
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed CheckContentProduct", errorMessage: error} as DynamicResult, {status: 400});
    }
}