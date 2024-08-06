import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        let result:Users[] = [{
            id: 0,
            name : "",
            email: "",
            gender: "",
            password: "",
            role: ""
        }];
        const body:Users = await req.json();
        if(body.email != "" || body.email != null){
            const {data, error} = await supabase
                .from('users')
                .select("*")
                .eq("email", body.email)
                .limit(1)
            if(error != null){
                return NextResponse.json({ status: "Failed",  msg: "Error fetch user", errorMessage: error?.message}, { status: 400 });
            }
            result = data;
        }else{
            const {data, error} = await supabase
                .from('users')
                .select("*")
            if(error != null){
                return NextResponse.json({ status: "Failed", msg: "Error fetch user", errorMessage: error?.message }, { status: 400 });
            }
            result = data;
        }
        return NextResponse.json({status: "OK", msg: "Get all user", data: result}, {status: 200});
    }
    catch(error) {
        return NextResponse.json({status: "Failed", msg: "Failed User Detail", errorMessage: error}, {status: 400});
    }
}