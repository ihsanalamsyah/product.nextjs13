import { NextResponse, NextRequest } from "next/server";
import User from '../models/userModel';
import Product from "../models/productModel";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
    let result:DynamicResult =  {
        status: "",
        msg: "",
        errorMessage: "",
        data: []
    }
    try {
        const body:Users = await req.json();
        let mapUserProducts: any[] = [];
        const response = await supabase
            .from('users')
            .select()
            .eq('email', body.email)
            .limit(1)

        if(response.data?.length! <= 0){
            result.status = "Failed";
            result.msg = "user not exists";
            return NextResponse.json(result, {status : 300});
        }
        const user:Users = response.data![0];
        if(user.role == "User"){
            const { data, error } = await supabase.rpc('get_products_users', {
                email_args: body.email
            });
                         
            if(error != null){
                result.status = "Failed";
                result.msg = "error fetching data";
                result.errorMessage = error.message;
                return NextResponse.json(result, {status : 300});
            }
            mapUserProducts = data!;
           
        }
        else{
            const { data, error } = await supabase.rpc('get_products_users_admin');
            //console.log("data mapUserProducts admin", data)     
            if(error != null){
                result.status = "Failed";
                result.msg = "Error fetching data";
                result.errorMessage = error.message;
                return NextResponse.json(result, {status : 300});
            }
            mapUserProducts = data!;
           
        }
        //console.log("mapUserProducts api", mapUserProducts)
        result.status = "OK";
        result.msg = "Get User Product";
        result.data = mapUserProducts;
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
            .update({ enroll_date: body.enroll_date, user_id: body.user_id, row_status: true })
            .eq("id", body.product_id)

        if(error != null){
            return NextResponse.json({status: "Failed", msg: `Error mapping user to product`}, {status: 300});
        }
        if(count! <= 0 && count != null){
            return NextResponse.json({status: "Failed", msg: `Data Product is not exists`}, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Success mapping user: ${body.name} denagn id: ${body.user_id} to product: ${body.product_id}`, data: data}, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}