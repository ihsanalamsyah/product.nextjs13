import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';


function ValidateContentType(file: File):boolean{
    let result = false;
    if(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png"){
        result = true;
    }
    return result;
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const user_id = formData.get('user_id') as string;
        const isValidContentType = ValidateContentType(file!);
        if(!isValidContentType){
            return NextResponse.json({status: "Failed", msg: "Invalid image type", errorMessage: "Invalid image type"} as DynamicResult, {status: 400});
        }
        console.log("file Server Profile Picture", file);
        let respUploadStorage: any = await supabase.storage
            .from('images')
            .upload(`Foto-user-user_id-${user_id}.png`, file!);
                      
        if (respUploadStorage.error != null) {
            if(respUploadStorage.error.message == "The resource already exists"){
                let respUpdateStorage: any = await supabase
                    .storage
                    .from('images')
                    .update(`Foto-user-user_id-${user_id}.png`, file!, {
                    cacheControl: '3600',
                    upsert: true
                });
                                    
                if(respUpdateStorage.error != null){
                    return NextResponse.json({status: "Failed", msg: respUpdateStorage.error.message, errorMessage: respUpdateStorage.error.message} as DynamicResult, {status: 400});
                }else{
                    return NextResponse.json({status: "OK", msg: `Success upload image user ${user_id}`} as DynamicResult, {status: 200}); 
                }
            }else{
                return NextResponse.json({status: "Failed", msg: respUploadStorage.error.message, errorMessage: respUploadStorage.error.message} as DynamicResult, {status: 400});
            }
        }else{
            return NextResponse.json({status: "OK", msg: `Success update image user ${user_id}`} as DynamicResult, {status: 200}); 
        }   
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error, errorMessage: error} as DynamicResult, {status: 400});
    }
}