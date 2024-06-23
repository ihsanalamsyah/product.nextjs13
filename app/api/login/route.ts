import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import jwt  from 'jsonwebtoken';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import { resolve } from "path";
env.config();

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:Users = await req.json();
        const response = await User.findAll({
            where: {
                name: body.name
            }
        })
        if(response.length > 0){
            const comparePassword = await new Promise((resolve, reject) => {
                bcrypt.compare(body.password, response[0].toJSON().password, function(err, result) {
                  if (err) reject(err)
                  resolve(result)
                });
            })
            if(comparePassword){
                const token = await generateToken({
                    email: response[0].toJSON().email,
                    name: response[0].toJSON().name
                });
                return NextResponse.json({status: "OK", data: response[0].toJSON(), token: token}, {status: 200});
            }
            else{
                return NextResponse.json({status: "Failed", msg: "password invalid"}, {status: 400})
            }
            
        }
        else{
            return NextResponse.json({status: "Failed", msg: "name invalid"}, {status: 400})
        }
       
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}