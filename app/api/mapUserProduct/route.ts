import { NextResponse, NextRequest } from "next/server";
import User from '../models/userModel';
import Product from "../models/productModel";
import { Op, Sequelize } from 'sequelize';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:Users = await req.json();
        
        let result: MapUserProduct = {   
            productID: null,
            title: null,
            price: null,
            userID: null,
            enrollDate: null,
            userID2: null,
            name: null,
            email: null,
            password: null,
            gender: null,
            role: null,
        };
        let data: any = []
        const user = await User.findOne({
            where: {
                name: body.name
            }
        });
        if(user == null){
            return NextResponse.json({status: "Failed", msg: "user not exists"}, {status : 300});
        }
        if (user.dataValues.role == "User"){
           
            
        }
        else{
            const [results, metadata]: [any, any] = await Product.sequelize?.query(`
            select p.id as productID, p.title, p.price, p.userID, p.enrollDate, u.id as userID2, u.name, u.email, u.gender, u.password, u.role from crud_db.products p
            inner join crud_db.users u ON u.id = p.userID AND u.rowStatus = 1
            where p.rowStatus = 1;    
            `) as [any, any];
            const mapUserProducts = results;              
            mapUserProducts.forEach(mapUserProduct => {
                result = {
                    productID: mapUserProduct.productID,
                    title: mapUserProduct.title,
                    price: mapUserProduct.price,
                    userID: mapUserProduct.userID,
                    enrollDate: mapUserProduct.enrollDate,
                    userID2: mapUserProduct.userID2,
                    name: mapUserProduct.name,
                    email: mapUserProduct.email,
                    password: mapUserProduct.password,
                    gender: mapUserProduct.gender,
                    role: mapUserProduct.role,
                }
                data.push(result)
            });
        }
        return NextResponse.json({status: "OK", msg: "Get Product", mapUserProducts: data, user: user}, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status : 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        const body:MapUserProduct = await req.json();    
        const product = await Product.findOne({
            where: {
                id: body.productID
            }
        });
        if(product == null){
            return NextResponse.json({status: "Failed", msg: `Data is not exists`}, {status: 300});
        }
        product!.set({
            userID: body.userID,
            enrollDate : body.enrollDate,
            rowStatus: true
        })
        await product!.save();
        return NextResponse.json({status: "OK", msg: `User Product ${body.productID} Updated`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}