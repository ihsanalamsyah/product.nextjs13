import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import jwt  from 'jsonwebtoken';
import env from 'dotenv';
env.config();


export async function GET() {
    try {
        const response = await User.findAll();
        return NextResponse.json({status: "OK", msg: "Get User", data: response});
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET!;
        var body = await req.json();
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(body.password, salt, async function(err, hash){
                const data = {
                    name : body.name,
                    email: body.email || null,
                    gender: body.gender || null,
                    password: hash,
                    role: body.role || null
                }
                
                const alredyExist = await User.findAll({
                    where: {
                        name: body.name
                    }
                })
                if (alredyExist.length > 0){
                    return NextResponse.json({status: "Failed", msg: "name already exist"});
                }
                else{
                    await User.create(data);
                    //pembuatan token saat login success
                    const token = jwt.sign({
                        email: data.email,
                        name: data.name
                    }, JWT_SECRET, function(err, token){
                        return NextResponse.json({status: "OK", data: data, token: token});
                    })

                }
            })
        })
    }
    catch (error){
        return NextResponse.json({status: "Failed", error: error});
    }
}