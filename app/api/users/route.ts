import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import { supabase } from '@/utils/supabase';
env.config();


export async function GET() {
    try {
        const {data, error} = await supabase
            .from('users')
            .select()
        if(error != null){
            return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "Get all user", data: data}, {status: 200});
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"}, {status: 400});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:Users = await req.json();
        const result = {
            name : body.name,
            email: body.email,
            gender: body.gender,
            password: null,
            role: body.role,
            rowstatus: true
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
        
        let resultSignUp = await supabase.auth.signUp({
            email: body.email!,
            password: body.password!
        })
        if(resultSignUp.error != null){
            return NextResponse.json({ status: "error", msg: resultSignUp.error?.message }, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "user created", data: resultSignUp.data, token: resultSignUp.data.session!.access_token}, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error}, {status: 400});
    }
}