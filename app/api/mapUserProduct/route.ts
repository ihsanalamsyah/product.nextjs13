import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

async function ValidateImage(imageUrl:string):Promise<boolean>{
    let result: boolean = false;
    const response = await fetch(imageUrl);
    if(response.ok){
        result = true;
        return result;
    }else{
        return result;
    }
}
export async function POST(req: NextRequest, res: NextResponse) {
    let dataResult:MapUserProduct[] = [];
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
            let getUserProduct :any;
            if(body.category?.toLowerCase() == "video"){
                getUserProduct = await supabase.rpc('get_products_users_video', {
                    email_args: body.email,
                    search_args: search
                });
                dataResult = getUserProduct.data!;
                for(let i = 0; i < dataResult.length; i++){
                    const getImageUrl = supabase.storage
                        .from('videos')
                        .getPublicUrl(`thumbnails/Thumbnail-video-product_id-${dataResult[i].product_id}.jpg`);
                    const validateUrl = await ValidateImage(getImageUrl.data.publicUrl);
                    if(validateUrl){
                        dataResult[i].image_url =  getImageUrl.data.publicUrl;
                    }else{
                        dataResult[i].image_url =  "";
                    }
                }
            }else if(body.category?.toLowerCase() == "handphone"){
                getUserProduct = await supabase.rpc('get_products_users_phone', {
                    search_args: search
                });
                dataResult = getUserProduct.data!;
                for(let i = 0; i < dataResult.length; i++){
                    const getImageUrl = supabase.storage
                        .from('images')
                        .getPublicUrl(`Foto-product-product_id-${dataResult[i].product_id}.png`);
                    const validateUrl = await ValidateImage(getImageUrl.data.publicUrl);
                    if(validateUrl){
                        dataResult[i].image_url =  getImageUrl.data.publicUrl;
                    }else{
                        dataResult[i].image_url =  "";
                    }
                }
            }

            if(getUserProduct.error != null){
                return NextResponse.json({status: "Failed", msg: "Error fetching data", errorMessage: getUserProduct.error.message} as DynamicResult, {status: 300});
            }               
        }
        else{
            const { data, error } = await supabase.rpc('get_products_users_admin',{
                order_by1_args: body.order_by1,
                order_by2_args: body.order_by2,
                order_direction_args: body.order_direction,
            });
            if(error != null){
                return NextResponse.json({status: "Failed", msg: "Error fetching data", errorMessage: error.message} as DynamicResult, {status : 300});
            }
            dataResult = data!;  
        }
        //console.log("dataResult",dataResult)
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