import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import {supabase} from '@/utils/supabase';
env.config();


export async function GET() {
    try {
        const response = await User.findAll();
        return NextResponse.json({status: "OK", msg: "Get User", data: response}, {status: 200});
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
        if(error){
            console.error(error);
            return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
        }
        if(data) {
            console.log(data)
        }
        return NextResponse.json({status: "OK", data: data, token: "token"}, {status: 200});
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(body.password as string, 10, function(err, hash) {
              if (err) reject(err)
              resolve(hash)
            });
        })
        const result = {
            name : body.name,
            email: body.email,
            gender: body.gender,
            password: hashedPassword,
            role: body.role,
            rowStatus: true
        }
        const alredyExist = await User.findAll({
            where: {
                name: body.name
            }
        })
        if (alredyExist.length > 0){
            return NextResponse.json({status: "Failed",  msg: "name already exist", data: result}, {status: 400});
        }
        else{
            await User.create(result);

            const token = await generateToken({
                email: result.email,
                name: result.name
            });
            return NextResponse.json({status: "OK",  msg: "user created", data: result, token: token}, {status: 200});          
        }        
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error}, {status: 400});
    }
}