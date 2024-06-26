import { NextResponse, NextRequest } from "next/server";
import User from '../models/userModel';
import MapUserProduct from "../models/mapUserProductModel";
import Product from "../models/productModel";
import { Op, Sequelize } from 'sequelize';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:GetMapUserProduct = await req.json();
        let mapUserProduct;
        const user = await User.findOne({
            where: {
                name: body.name
            }
        });
        if (user?.dataValues.role == "User"){
            mapUserProduct = await MapUserProduct.sequelize?.query(`select * from crud_db.mapuserproduct;`);
        }
        else{
            mapUserProduct = await MapUserProduct.sequelize?.query(`
                select * from crud_db.mapuserproduct;`
            
            );        
        }
       
        return NextResponse.json({status: "OK", msg: "Get Product", mapUserProducts: mapUserProduct, user: user}, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status : 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        var body:MapUserProduct = await req.json();
        const data = {      
            userID: body.userID,
            productID : body.productID,
            enrollDate : body.enrollDate,
            rowStatus: true
        }
        await MapUserProduct.update(data,{
            where: {
                id: body.id
            }
        });
        return NextResponse.json({status: "OK", msg: `User Product ${body.id} Updated`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}