import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function GET() {
    try {
        let result:Users[] = [{
            id: 0,
            name : "",
            email: "",
            gender: "",
            password: "",
            role: ""
        }]
        const {data, error} = await supabase
            .from('users')
            .select("*")
        if(error != null){
            return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
        }
        result = data;
        
        return NextResponse.json({status: "OK", msg: "Get all user", data: result}, {status: 200});
    }
    catch(error) {
        return NextResponse.json({status: "Failed", msg: "Failed GET User", errorMessage: error}, {status: 400});
    }
}
