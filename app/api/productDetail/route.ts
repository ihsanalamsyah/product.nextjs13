import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');
        if(id != null){
            const {data, error} = await supabase
                .from('products')
                .select()
                .eq('id', id)
                .eq('row_status', true)
                .limit(1)
            if(error != null){
                return NextResponse.json({status: "Failed", msg: "Error fetch product", errorMessage: error.message} as DynamicResult, {status: 400});
            }
            if(data.length <= 0){
                return NextResponse.json({status: "Failed", msg: "Product is not exists", errorMessage: "Product is not exists"} as DynamicResult, {status: 400}); 
            }
            return NextResponse.json({status: "OK", msg: `Get Product ${id}`, data: data} as DynamicResult, {status: 200});
        }else{
            return NextResponse.json({status: "OK", msg: "Search param not exists", errorMessage: "Search param not exists"} as DynamicResult, {status: 400});
        }
    }
    catch(error) {
        return NextResponse.json({status: "Failed", msg: "Failed Product Detail", errorMessage: error} as DynamicResult, {status: 400});
      
    }
}