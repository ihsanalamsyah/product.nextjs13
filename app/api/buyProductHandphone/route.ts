
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
            return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: user.error?.message } as DynamicResult, { status: 400 });
        }
        const user_id:number = user.data[0].id;
        const product = await supabase
            .from('products')
            .select()
            .eq("id", body.product_id!)
            .limit(1)
        if(product.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: product.error?.message } as DynamicResult, { status: 400 });
        }
        let quantityProduct: number = product.data[0].quantity;
        quantityProduct = quantityProduct - body.quantity!;

        if(quantityProduct < 0){
            return NextResponse.json({ status: "Failed", msg: "Product quantity < 0", errorMessage: "Product quantity < 0" } as DynamicResult, { status: 400 });
        }

        const updateQty = await supabase
            .from("products")
            .update({ quantity: quantityProduct, updated_date: today})
            .eq("id", body.product_id!)
            .select()
        if(updateQty.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error update qty product", errorMessage: updateQty.error?.message } as DynamicResult, { status: 400 });
        }
        
        const getMapUserProduct = await supabase
            .from("map_user_product")
            .select()
            .eq("product_id", body.product_id!)
            .eq("user_id", user_id)
            .limit(1)
        if(getMapUserProduct.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error get map user product", errorMessage: getMapUserProduct.error?.message } as DynamicResult, { status: 400 });
        }
        
        if(getMapUserProduct.data?.length! > 0){
            
            quantityProduct = getMapUserProduct.data[0].quantity;
            const quantity:number = quantityProduct + body.quantity;
            const updateMapUserProduct = await supabase
                .from("map_user_product")
                .update({quantity: quantity, updated_date: today})
                .eq("product_id", body.product_id!)
                .eq("user_id", user_id)

            if(updateMapUserProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error update map user product", errorMessage: updateMapUserProduct.error?.message } as DynamicResult, { status: 400 });
            }
        }else{
            const insertData = {
                product_id: body.product_id!,
                user_id: user_id,
                quantity: body.quantity!,
                row_status: true,
                created_date: today,
            }
            const insertMapUserProduct = await supabase
                .from("map_user_product")
                .insert(insertData);
            if(insertMapUserProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error insert map user product", errorMessage: insertMapUserProduct.error?.message } as DynamicResult, { status: 400 });
            }
        }
        const insertData = {
            product_id: body.product_id!,
            user_id: user_id,
            quantity: body.quantity!,
            row_status: true,
            created_date: today,
        }
        const insertHistoryBuyProduct = await supabase
            .from("history_buy_product")
            .insert(insertData);

        if(insertHistoryBuyProduct.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error insert history buy product", errorMessage: insertHistoryBuyProduct.error?.message } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({ status: "OK", msg: `Success buy product ${body.product_id!} with qty: ${body.quantity!}`, data: updateQty.data} as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Buy Product", errorMessage: error} as DynamicResult, {status: 400});
    }
}