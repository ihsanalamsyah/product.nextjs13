import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
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
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(body.password as string, 10, function(err, hash) {
              if (err) reject(err)
              resolve(hash)
            });
        })
        const data = {
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
            return NextResponse.json({status: "Failed",  msg: "name already exist", data: data}, {status: 400});
        }
        else{
            await User.create(data);

            const token = await generateToken({
                email: data.email,
                name: data.name
            });
            return NextResponse.json({status: "OK",  msg: "user created", data: data, token: token}, {status: 200});          
        }        
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error}, {status: 400});
    }
}