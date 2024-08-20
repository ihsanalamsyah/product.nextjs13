import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
    let result:DynamicResult =  {
        status: "",
        msg: "",
        errorMessage: "",
        data: []
    }
    let dataResult:MapUserProduct[] = [{
        product_id: 0,
        title: "",
        price: 0,
        quantity: 0,
        category: "",
        user_id: 0,
        enroll_date: null,
        user_id2: 0,
        name: "",
        email: "",
        password: "",
        gender: "",
        role: "",
        search: ""
    }];
    try {
        const body:MapUserProduct = await req.json();
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
        const search = body.search ?? "";
        const user:Users = response.data![0];
        if(user.role == "User"){
            let responseGetUserProduct :any;
            if(body.category?.toLowerCase() == "video"){
                responseGetUserProduct = await supabase.rpc('get_products_users_video', {
                    email_args: body.email,
                    search_args: search
                });
            }else if(body.category?.toLowerCase() == "phone"){
                responseGetUserProduct = await supabase.rpc('get_products_users_phone', {
                    search_args: search
                });
            }

            if(responseGetUserProduct.error != null){
                result.status = "Failed";
                result.msg = "error fetching data";
                result.errorMessage = responseGetUserProduct.error.message;
                return NextResponse.json(result, {status : 300});
            }             
            dataResult = responseGetUserProduct.data!;       
        }
        else{
            const { data, error } = await supabase.rpc('get_products_users_admin', {
                search_args: search
            });
            if(error != null){
                result.status = "Failed";
                result.msg = "Error fetching data";
                result.errorMessage = error.message;
                return NextResponse.json(result, {status : 300});
            }
            dataResult = data!;
           
        }
        result.status = "OK";
        result.msg = "Get User Product";
        result.data = dataResult;
        //console.log("data result user", dataResult)  
        return NextResponse.json({status: "OK", msg: "Get User Product", data: dataResult}, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed POST MapUserProduct", errorMessage: error}, {status : 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        const body:MapUserProduct = await req.json();
        const today = new Date();
        const { data, error, count } = await supabase
            .from("products")
            .update({ enroll_date: body.enroll_date, user_id: body.user_id, row_status: true, updated_date: today})
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
        return NextResponse.json({status: "Failed", msg: "Failed PATCH MapUserProduct", errorMessage: error}, {status: 300});
    }
}