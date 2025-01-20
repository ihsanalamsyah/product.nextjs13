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
        const { data, error } = await supabase.rpc('search_products',{
            email_args: body.email,
            search_args: body.search
        });
        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error fetch function admin", data: error.message} as DynamicResult, {status : 300});
        }
        dataResult = data!;
        for(let i = 0; i < dataResult.length; i++){
            if(dataResult[i].category == "Video"){
                const getImageUrl = supabase.storage
                    .from('videos')
                    .getPublicUrl(`thumbnails/Thumbnail-video-product_id-${dataResult[i].product_id}.jpg`);
                const validateUrl = await ValidateImage(getImageUrl.data.publicUrl);
                if(validateUrl){
                    dataResult[i].image_url =  getImageUrl.data.publicUrl;
                }else{
                    dataResult[i].image_url =  "";
                }
            }else{
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
        return NextResponse.json({status: "OK", msg: "Get User Product", data: dataResult} as DynamicResult, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed POST GetAllProductAdmin", errorMessage: error} as DynamicResult, {status : 400});
    }
}
