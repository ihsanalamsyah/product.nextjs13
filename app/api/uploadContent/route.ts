import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

function ValidateContentType(category:string, file: File):boolean{
    let result = false;
    if(category == "Video" && (file.type == "video/mp4")){
        result = true;
    }else if(category == "Handphone" && (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png")){
        result = true;
    }
    return result;
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string;
        const product_id = formData.get('product_id') as string;
        let respUploadStorage: any;
        if(category == "Video"){
            const isValidContentType = ValidateContentType(category!, file!);
            if(isValidContentType){
                respUploadStorage = await supabase.storage
                    .from('videos')
                    .upload(`Video-product-product_id-${product_id}.mp4`, file!);          
            }else{
                return NextResponse.json({status: "Failed", msg: "Invalid video type", errorMessage: "Invalid video type"} as DynamicResult, {status: 400});
            }
        }else{
            const isValidContentType = ValidateContentType(category!, file!);
            if(isValidContentType){
                respUploadStorage = await supabase.storage
                    .from('images')
                    .upload(`Foto-product-product_id-${product_id}.png`, file!);
            }else{
                return NextResponse.json({status: "Failed", msg: "Invalid photo type", errorMessage: "Invalid photo type"} as DynamicResult, {status: 400});
            }                    
        }
        if (respUploadStorage.error != null) {
            if(respUploadStorage.error.message == "The resource already exists"){
                let respUpdateStorage: any;    
                if(category == "Video"){
                    respUpdateStorage = await supabase
                        .storage
                        .from('videos')
                        .update(`Video-product-product_id-${product_id}.mp4`, file!, {
                        cacheControl: '3600',
                        upsert: true
                    })
                }else{
                    respUpdateStorage = await supabase
                        .storage
                        .from('images')
                        .update(`Foto-product-product_id-${product_id}.png`, file!, {
                        cacheControl: '3600',
                        upsert: true
                    })
                }           
                if(respUpdateStorage.error != null){
                    return NextResponse.json({status: "Failed", msg: respUpdateStorage.error.message, errorMessage: respUpdateStorage.error.message} as DynamicResult, {status: 400});
                }else{
                    return NextResponse.json({status: "OK", msg: `Success update content to product ID ${product_id}`} as DynamicResult, {status: 200});
                }
            }else{
                return NextResponse.json({status: "Failed", msg: respUploadStorage.error.message, errorMessage: respUploadStorage.error.message} as DynamicResult, {status: 400});
            }               
        }else{
            if(category == "Video"){
                return NextResponse.json({status: "OK", msg: `Success upload video to product ID ${product_id}`} as DynamicResult, {status: 200});
            }else{
                return NextResponse.json({status: "OK", msg: `Success upload image to product ID ${product_id}`} as DynamicResult, {status: 200});
            }
        }
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error, errorMessage: error} as DynamicResult, {status: 400});
    }
}