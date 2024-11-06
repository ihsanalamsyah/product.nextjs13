import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
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
        search: "",
        image_url: "",
        video_url: ""
    }];
    try {
        const body:MapUserProduct = await req.json();
        const response = await supabase
            .from('users')
            .select()
            .eq('email', body.email)
            .limit(1)

        if(response.data?.length! <= 0){
            return NextResponse.json({status: "Failed", msg: "User not exists"} as DynamicResult, {status : 300});
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
                dataResult = responseGetUserProduct.data!;
                for(let i = 0; i < dataResult.length; i++){
                    const getImageUrl = supabase.storage
                        .from('images')
                        .getPublicUrl(`Video-product_id-${dataResult[i].product_id}.mp4`);
                
                    dataResult[i].video_url =  getImageUrl.data.publicUrl;
                }
            }else if(body.category?.toLowerCase() == "handphone"){
                responseGetUserProduct = await supabase.rpc('get_products_users_phone', {
                    search_args: search
                });
                dataResult = responseGetUserProduct.data!;
                for(let i = 0; i < dataResult.length; i++){
                    const getImageUrl = supabase.storage
                        .from('images')
                        .getPublicUrl(`Foto-product-product_id-${dataResult[i].product_id}.png`);
                
                    dataResult[i].image_url =  getImageUrl.data.publicUrl;
                }
            }

            if(responseGetUserProduct.error != null){
                return NextResponse.json({status: "Failed", msg: "Error fetching data", errorMessage: responseGetUserProduct.error.message} as DynamicResult, {status: 300});
            }               
        }
        else{
            const { data, error } = await supabase.rpc('get_products_users_admin', {
                search_args: search
            });
            if(error != null){
                return NextResponse.json({status: "Failed", msg: "Error fetching data", errorMessage: error.message} as DynamicResult, {status : 300});
            }
            dataResult = data!;
           
        }
        return NextResponse.json({status: "OK", msg: "Get User Product", data: dataResult} as DynamicResult, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed POST MapUserProduct", errorMessage: error} as DynamicResult, {status : 400});
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
            return NextResponse.json({status: "Failed", msg: `Error mapping user to product`} as DynamicResult, {status: 300});
        }
        if(count! <= 0 && count != null){
            return NextResponse.json({status: "Failed", msg: `Data Product is not exists`} as DynamicResult, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Success mapping user: ${body.name} denagn id: ${body.user_id} to product: ${body.product_id}`, data: data} as DynamicResult, {status: 200});
     
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed PATCH MapUserProduct", errorMessage: error} as DynamicResult, {status: 300});
    }
}