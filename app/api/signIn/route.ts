import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:Users = await req.json();
        const today = new Date();
        let { data, error } = await supabase.auth.signUp({
            email: body.email!,
            password: body.password!
        })
        if(error != null){
            return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
        }
        const result = {
            name : body.name,
            email: body.email,
            gender: body.gender,
            password: null,
            role: body.role,
            row_status: true,
            created_date: today
        }
        const resultAlreadyExists = await supabase
            .from('users')
            .select()
            .eq('email', body.email)
        if (resultAlreadyExists.data!.length! > 0){
            return NextResponse.json({status: "Failed",  msg: "Email already exist", data: resultAlreadyExists.data!}, {status: 400});
        }
        const resultInsert  = await supabase
            .from('users')
            .insert(result)
        if (resultInsert.error != null){
            return NextResponse.json({ status: "error", msg: resultInsert.error?.message }, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "User success created. Please check your email and confirm first and then login"}, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error}, {status: 400});
    }
}