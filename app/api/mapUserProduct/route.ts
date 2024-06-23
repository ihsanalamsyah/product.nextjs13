import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import MapUserProduct from "../models/mapUserProductModel";
import Product from "../models/productModel";
import jwt  from 'jsonwebtoken';
import env from 'dotenv';
import generateToken from '@/utils/generateToken';
import { resolve } from "path";
import { Op } from 'sequelize';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:GetMapUserProduct = await req.json();
        let response;
        const user = await User.findOne({
            where: {
                name: body.name
            }
        });
        console.log("Role :", user?.dataValues.role);
        if ( user?.dataValues.role == "User"){
            console.log("name body :", body.name);
            response = await MapUserProduct.findAll({             
                include: [
                {
                    model: User,
                    right: true
                },{
                    model: Product,
                    required: false
                }]
            });
        }
        else{
            response = await MapUserProduct.findAll({             
                include: [
                {
                    model: Product,
                    required: false,
                    right: true
                },{
                    model: User,
                    required: true,
                    right: false
                }]
            });
            console.log("response admin :", response);
        }
       
        return NextResponse.json({status: "OK", msg: "Get Product", mapUserProduct: response, user: "OK"}, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status : 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        var body:MapUserProduct = await req.json();
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');
        await MapUserProduct.update(body,{
            where: {
                id: id
            }
        });
        return NextResponse.json({status: "OK", msg: `User Product ${id} Updated`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}