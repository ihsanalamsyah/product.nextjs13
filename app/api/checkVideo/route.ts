import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:CheckVideo = await req.json();

        const response = await fetch(body.video_url);
        if(response.ok){
            return NextResponse.json({status: "OK", msg: "Success check video"} as DynamicResult, {status: 200});
        }else{
            return NextResponse.json({status: "Failed", msg: "Video not exists"} as DynamicResult, {status: 404});
        }
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error} as DynamicResult, {status: 400});
    }
}