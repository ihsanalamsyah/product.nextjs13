
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:BuyProduct = await req.json();
        const today = new Date();
        const user = await supabase
            .from('users')
            .select()
            .eq("email", body.email!)
            .limit(1)
        if(user.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: user.error?.message }, { status: 400 });
        }
        const user_id:number = user.data[0].id;
        const getProduct = await supabase
            .from('products')
            .select()
            .eq("id", body.product_id!)
            .limit(1)
        if(getProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: getProduct.error?.message }, { status: 400 });
        }
        let quantityProduct: number = getProduct.data[0].quantity;
        quantityProduct = quantityProduct - body.quantity!;

        if(quantityProduct < 0){
            return NextResponse.json({ status: "Failed", msg: "Product cannot < 0", errorMessage: "Product quantity cannot < 0" }, { status: 400 });
        }

        const responseUpdateQty = await supabase
            .from("products")
            .update({ quantity: quantityProduct, updated_date: today})
            .eq("id", body.product_id!)
            .select()
        if(responseUpdateQty.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error update qty product", errorMessage: responseUpdateQty.error?.message }, { status: 400 });
        }
        
        const responseGetMapUserProduct = await supabase
            .from("map_user_product")
            .select()
            .eq("product_id", body.product_id!)
            .eq("user_id", user_id)
            .limit(1)
        if(responseGetMapUserProduct.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error get map user product", errorMessage: responseGetMapUserProduct.error?.message }, { status: 400 });
        }
        
        if(responseGetMapUserProduct.data?.length! > 0){
            
            quantityProduct = responseGetMapUserProduct.data[0].quantity;
            const quantity:number = quantityProduct + body.quantity;
            const responseUpdateMapUserProduct = await supabase
                .from("map_user_product")
                .update({quantity: quantity, updated_date: today})
                .eq("product_id", body.product_id!)
                .eq("user_id", user_id)

            if(responseUpdateMapUserProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error update map user product", errorMessage: responseUpdateMapUserProduct.error?.message }, { status: 400 });
            }
        }else{
            const insertData = {
                product_id: body.product_id!,
                user_id: user_id,
                quantity: body.quantity!,
                row_status: true,
                created_date: today,
            }
            const responseInsertMapUserProduct = await supabase
                .from("map_user_product")
                .insert(insertData);
            if(responseInsertMapUserProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error insert map user product", errorMessage: responseInsertMapUserProduct.error?.message }, { status: 400 });
            }
        }
       
        return NextResponse.json({ status: "OK", msg: `Success buy product ${body.product_id!} with qty: ${body.quantity!}`, data: responseUpdateQty.data}, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Buy Product", errorMessage: error}, {status: 400});
    }
}