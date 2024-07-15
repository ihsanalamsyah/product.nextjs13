import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import { supabase } from '@/utils/supabase';
env.config();


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        let result:Users[] = [{
            id: 0,
            name : "",
            email: "",
            gender: "",
            password: "",
            role: ""
        }]
        var body:Users = await req.json();
        if(body.email != "" || body.email != null){
            const {data, error} = await supabase
                .from('users')
                .select()
                .eq("email", body.email)
            if(error != null){
                return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
            }
            result = data;
        }else{
            const {data, error} = await supabase
                .from('users')
                .select()
            if(error != null){
                return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
            }
            result = data;
        }
        
        
        return NextResponse.json({status: "OK", msg: "Get all user", data: result}, {status: 200});
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"}, {status: 400});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:Users = await req.json();
             
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
            row_status: true
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
        return NextResponse.json({status: "OK", msg: "user success created please confirm your email first and then login"}, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error}, {status: 400});
    }
}