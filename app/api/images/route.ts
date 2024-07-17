import { NextResponse, NextRequest } from "next/server";
import {supabase} from '@/utils/supabase';


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        // const body:GetImage = await req.json();
        // const { data, error } = await supabase.storage.from('images').download('public/MicrosoftTeams-image (16).png')
 
        // if (error != null) {
        //     return NextResponse.json({ status: "error", msg: "Error get images", errorMessage: error.message }, { status: 400 });
        // }
        return NextResponse.json({status: "OK", msg: "Success get image"}, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}