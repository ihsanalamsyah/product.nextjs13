
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:BuyProduct = await req.json();
        const today = new Date();
        // get user id
        const user = await supabase
            .from('users')
            .select()
            .eq("email", body.email!)
            .limit(1)
        if(user.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch product", errorMessage: user.error?.message } as DynamicResult, { status: 400 });
        }
        const user_id:number = user.data[0].id;
        // get quantity product
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
 
        const getCarts = await supabase
            .from("carts")
            .select()
            .eq("product_id", body.product_id!)
            .eq("user_id", user_id)
            .limit(1)
        if(getCarts.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error get carts", errorMessage: getCarts.error?.message } as DynamicResult, { status: 400 });
        }
        
        if(getCarts.data?.length! > 0){
            // exists carts
            quantityProduct = getCarts.data[0].quantity;
            const updatedQty:number = quantityProduct + body.quantity;
            if (product.data[0].category == "Video") {
                return NextResponse.json({ status: "Failed", msg: "Tidak bisa melebihi quantity", errorMessage: "Tidak bisa melebihi quantity" } as DynamicResult, { status: 400 });
            }
            if (product.data[0].quantity < updatedQty) {
                return NextResponse.json({ status: "Failed", msg: "Tidak bisa melebihi quantity", errorMessage: "Tidak bisa melebihi quantity" } as DynamicResult, { status: 400 });
            }
            const updateCarts = await supabase
                .from("carts")
                .update({quantity: updatedQty, updated_date: today})
                .eq("product_id", body.product_id!)
                .eq("user_id", user_id)

            if(updateCarts.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error update carts", errorMessage: updateCarts.error?.message } as DynamicResult, { status: 400 });
            }
        }else{
            // new carts
            const insertData = {
                product_id: body.product_id!,
                user_id: user_id,
                quantity: body.quantity!,
                row_status: true,
                created_date: today,
            }
            const insertCarts = await supabase
                .from("carts")
                .insert(insertData);
            if(insertCarts.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error insert carts", errorMessage: insertCarts.error?.message } as DynamicResult, { status: 400 });
            }
        }
        return NextResponse.json({ status: "OK", msg: `Success store to cart product ${product.data[0].title} qty: ${body.quantity!}`} as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Buy Product", errorMessage: error} as DynamicResult, {status: 400});
    }
}