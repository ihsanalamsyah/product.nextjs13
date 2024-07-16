import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {
    let result:DynamicResult =  {
        status: "",
        msg: "",
        errorMessage: "",
        data: []
    }
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
                result.status = "Failed";
                result.msg = "Error fetch product";
                result.errorMessage = error?.message;
                return NextResponse.json(result, { status: 400 });
            }
            if(data.length <= 0){
                result.status = "Failed";
                result.msg = "Product is not exists";
                return NextResponse.json(result, { status: 400 });
            }
            result.status = "OK";
            result.msg = `Get Product ${id}`;
            result.data = data;
            return NextResponse.json(result,{ status: 200 } );
        }
    }
    catch {
        result.status = "Failed";
        result.msg = "Error";
        return NextResponse.json(result);
    }
    return NextResponse.json(result);
}