import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:CheckImage = await req.json();

        const response = await fetch(body.image_url);
        if(response.ok){
            return NextResponse.json({status: "OK", msg: "Success check image"}, {status: 200});
        }else{
            return NextResponse.json({status: "Failed", msg: "Failed check image, Image is not exists"}, {status: 404});
        }
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}