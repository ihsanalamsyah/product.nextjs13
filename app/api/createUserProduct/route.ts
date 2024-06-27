import { NextResponse, NextRequest } from "next/server";
import { Op } from 'sequelize';


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:MapUserProduct = await req.json();
        const data = {         
            userID: body.userID,
            productID : body.productID,
            enrollDate : body.enrollDate,
            rowStatus: true
        }
        console.log("data", data)
        // const mapUserProduct = await MapUserProduct.findAll({
        //     where:{
        //         productID: {
        //           [Op.eq]: body.productID
        //         }
        //     }
        // });
        // if(mapUserProduct.length > 0){
        //     await MapUserProduct.update(data,{
        //         where: {
        //             productID: {
        //               [Op.eq]: body.productID
        //             }
        //         }
        //     });
        //     return NextResponse.json({status: "OK", msg: "User Product Updated"}, {status : 200});
        // }
        // else{
        //     await MapUserProduct.create(data);
        //     return NextResponse.json({status: "OK", msg: "User Product Created"}, {status : 201});
        // }        
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error},{status: 400});
    }
}