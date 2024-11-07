
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {

    try {
        const historyBuyProduct = await supabase.rpc('get_history_buy_product');
        if(historyBuyProduct.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: historyBuyProduct.error.message } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({ status: "OK", msg: "Success", data: historyBuyProduct.data } as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed get tracker", errorMessage: error} as DynamicResult, {status: 400});
    }
}