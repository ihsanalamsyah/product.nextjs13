import { NextResponse, NextRequest } from "next/server";
import User from '../models/userModel';
import Product from "../models/productModel";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:Users = await req.json();
        
        let mapUserProducts: MapUserProduct[] = [];
        const response = await supabase
            .from('users')
            .select()
            .eq('email', body.email)
            .limit(1)

        if(response.data?.length! <= 0){
            return NextResponse.json({status: "Failed", msg: "user not exists"}, {status : 300});
        }
        const user:Users = response.data![0];

        if(user.role == "User"){
            const {data, error} = await supabase
                .from('products')
                .select()
            if(error != null){
                return NextResponse.json({status: "Failed", msg: "error fetching data"}, {status : 300});
            }
            mapUserProducts = data!;
           
        }
        else{
            const {data, error} = await supabase
                .from('products')
                .select()
            if(error != null){
                return NextResponse.json({status: "Failed", msg: "error fetching data"}, {status : 300});
            }
            mapUserProducts= data!;
           
        }
        return NextResponse.json({status: "OK", msg: "Get User Product", mapUserProducts: mapUserProducts, user: user}, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status : 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        const body:MapUserProduct = await req.json();

        const { data, error, count } = await supabase
            .from("products")
            .update({ enrolldate: body.enrollDate, userid: body.userID, rowstatus: true })
            .eq("id", body.productID)
        if(error != null){
            return NextResponse.json({status: "Failed", msg: `Error mapping user to product`}, {status: 300});
        }
        if(count! <= 0){
            return NextResponse.json({status: "Failed", msg: `Data Product is not exists`}, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Success mapping user: ${body.name} denagn id: ${body.userID} to product: ${body.productID}`, data: data}, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}