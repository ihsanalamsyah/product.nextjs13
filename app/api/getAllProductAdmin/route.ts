import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

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
        const { data, error } = await supabase.rpc('get_products_users_admin',{
            order_by1_args: body.order_by1,
            order_by2_args: body.order_by2,
            order_direction_args: body.order_direction,
        });
        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error fetch function admin", data: error.message} as DynamicResult, {status : 300});
        }
        console.log("getUserProduct", data);
        dataResult = data!;
        return NextResponse.json({status: "OK", msg: "Get User Product", data: dataResult} as DynamicResult, {status : 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed POST GetAllProductAdmin", errorMessage: error} as DynamicResult, {status : 400});
    }
}
