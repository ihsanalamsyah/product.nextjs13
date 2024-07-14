import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import {supabase} from '@/utils/supabase';
env.config();

export async function POST(req: NextRequest, res: NextResponse) {

    try {

        const body:Users = await req.json();
        let { data, error } = await supabase.auth.signInWithPassword({
            email: body.email!,
            password: body.password!
        })
       
        if (error != null) {
            return NextResponse.json({ status: "error", msg: "Error login" }, { status: 400 });
        }
        let user = await supabase
            .from("users")
            .select()
            .eq("email", body.email!)
            .limit(1)
        let dataUser: Users = {
            id:  user.data![0].id,
            name:  user.data![0].name,
            password:  user.data![0].password,
            role : user.data![0].role,
            email : user.data![0].email,
            gender : user.data![0].gender

        }
        return NextResponse.json({status: "OK", msg: "Success login", data: dataUser, token: data.session?.access_token}, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}