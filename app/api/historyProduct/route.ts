
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

function formatDate(dateStr:string):string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateStr); // Convert string to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
    const month = months[date.getMonth()]; // Get month abbreviation
    const year = date.getFullYear(); // Get year

    return `${day}-${month}-${year}`;
}
export async function POST(req: NextRequest, res: NextResponse) {
    let historyBuyProduct:HistoryBuyProduct[] = [];
    try {
        const body:HistoryBuyProduct = await req.json();
        const result = await supabase.rpc('new_function',{
            startdate_args: body.start_date,
            enddate_args: body.end_date,
        });
        historyBuyProduct = result.data!;
        for(let i = 0; i < historyBuyProduct.length; i++){
            historyBuyProduct[i].format_created = formatDate(historyBuyProduct[i].format_created);
        }
        if(result.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: result.error.message } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({ status: "OK", msg: "Success", data: historyBuyProduct } as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed get tracker", errorMessage: error} as DynamicResult, {status: 400});
    }
}