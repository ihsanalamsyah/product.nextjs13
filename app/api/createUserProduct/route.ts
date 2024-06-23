import { NextResponse, NextRequest } from "next/server";
import MapUserProduct from "../models/mapUserProductModel";
import { Op } from 'sequelize';


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:MapUserProduct = await req.json();
        const response = await MapUserProduct.findAll({
            where:{
                product_id: {
                  [Op.eq]: body.product_id
                }}
        });
        if(response.length > 0){
            await MapUserProduct.update(body,{
                where: {
                    product_id: {
                      [Op.eq]: body.product_id
                    }}
            });
        }
        else{
            await MapUserProduct.create(body);
        }
        
        return NextResponse.json({status: "OK", msg: "User Product Created"}, {status : 201});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error},{status: 400});
    }
}