
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:CheckoutProduct = await req.json();
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
        for (let i = 0; i < body.carts.length; i++) {
            const insertData = {
                product_id: body.carts[i].product_id!,
                user_id: user_id,
                quantity: body.carts[i].quantity!,
                row_status: true,
                created_date: today,
            }
            // insert history
            const insertHistoryBuyProduct = await supabase
                .from("history_buy_product")
                .insert(insertData);
    
            if(insertHistoryBuyProduct.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error insert history buy product", errorMessage: insertHistoryBuyProduct.error?.message } as DynamicResult, { status: 400 });
            }
            // update quantity product
            const product = await supabase
                .from('products')
                .select()
                .eq("id", body.carts[i].product_id!)
                .limit(1)
            if(product.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: product.error?.message } as DynamicResult, { status: 400 });
            }
            let quantityProduct: number = product.data[0].quantity;
            quantityProduct = quantityProduct - body.carts[i].quantity!;
            const updateQty = await supabase
                .from("products")
                .update({ 
                    ...(body.carts[i].category === "Handphone" && { quantity: quantityProduct }),
                    updated_date: today,
                    ...(body.carts[i].category === "Video" && { enroll_date: today }),
                    ...(body.carts[i].category === "Video" && { user_id: user_id })
                })
                .eq("id", body.carts[i].product_id!)
            if(updateQty.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error update qty product", errorMessage: updateQty.error?.message } as DynamicResult, { status: 400 });
            }
            //update cart
            const deleteCart = await supabase
                .from('carts')
                .delete()
                .eq("product_id", body.carts[i].product_id!)
                .eq("user_id", user_id)
                .eq("row_status", true)
            if(deleteCart.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error delete carts", errorMessage: deleteCart.error?.message } as DynamicResult, { status: 400 });
            }
        }
        
        return NextResponse.json({ status: "OK", msg: `Success checkout product`, data: `Success checkout product`} as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Buy Product", errorMessage: error} as DynamicResult, {status: 400});
    }
}