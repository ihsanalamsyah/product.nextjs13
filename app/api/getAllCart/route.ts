import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

async function ValidateImage(imageUrl:string):Promise<boolean>{
    let result: boolean = false;
    const response = await fetch(imageUrl);
    if(response.ok){
        result = true;
        return result;
    }else{
        return result;
    }
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:BuyProduct = await req.json();
        const user = await supabase
            .from('users')
            .select()
            .eq("email", body.email!)
            .limit(1)
        if(user.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch user", errorMessage: user.error?.message } as DynamicResult, { status: 400 });
        }
        const user_id:number = user.data[0].id;
        //get carts
        const carts = await supabase
            .from('carts')
            .select(`
                cart_id,
                quantity,
                product_id`)
            .eq("user_id", user_id)
            .eq("row_status", true)
        let getCarts:Cart[] = [];
        if (carts.data != null) {
            for (let i = 0; i < carts.data.length; i++) {
                //get products
                const product = await supabase
                    .from('products')
                    .select()
                    .eq("id", carts.data[i].product_id)
                    .eq("row_status", true)
                    .limit(1)

                if (product.data != null && product.data.length > 0) {
                    let getImageUrl:any;
                    if (product.data[0].category == "Handphone") {
                        getImageUrl = supabase.storage
                            .from('images')
                            .getPublicUrl(`Foto-product-product_id-${product.data[0].id}.png`);
                    }
                    else{
                        getImageUrl = supabase.storage
                            .from('videos')
                            .getPublicUrl(`thumbnails/Thumbnail-video-product_id-${product.data[0].id}.jpg`);
                    }
                    const validateUrl = await ValidateImage(getImageUrl.data.publicUrl);
                    if (validateUrl) {
                        getCarts.push({
                            cart_id: carts.data[i].cart_id,
                            quantity: carts.data[i].quantity,
                            category: product.data[0].category,
                            product_id: product.data[0].id,
                            checkbox: true,
                            products: {
                                id: product.data[0].id,
                                title: product.data[0].title,
                                category: product.data[0].category,
                                description: product.data[0].description,
                                quantity: product.data[0].quantity,
                                price: product.data[0].price,
                                image_url: getImageUrl.data.publicUrl,
                                video_url: null
                            }
                        })
                    }else{
                        getCarts.push({
                            cart_id: carts.data[i].cart_id,
                            quantity: carts.data[i].quantity,
                            product_id: product.data[0].id,
                            category: product.data[0].category,
                            checkbox: true,
                            products: {
                                id: product.data[0].id,
                                title: product.data[0].title,
                                category: product.data[0].category,
                                description: product.data[0].description,
                                quantity: product.data[0].quantity,
                                price: product.data[0].price,
                                image_url: "",
                                video_url: null
                            }
                        })
                    }
                } 
            }
        }    
        if(carts.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch carts", errorMessage: carts.error?.message } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({ status: "OK", msg: `Success get Carts`, data: getCarts} as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed get carts", errorMessage: error} as DynamicResult, {status: 400});
    }
}

export async function DELETE(req: NextRequest, res: NextResponse) {

    try {
        const body:BuyProduct = await req.json();
        const user = await supabase
            .from('users')
            .select()
            .eq("email", body.email!)
            .limit(1)
        if(user.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch user", errorMessage: user.error?.message } as DynamicResult, { status: 400 });
        }
        const user_id:number = user.data[0].id;
        for (let i = 0; i < body.carts.length; i++) {
            const deleteCart = await supabase
                .from('carts')
                .delete()
                .eq("product_id", body.carts[i].product_id)
                .eq("user_id", user_id)
                .eq("row_status", true)
            if(deleteCart.error != null){
                return NextResponse.json({ status: "Failed", msg: "Error delete carts", errorMessage: deleteCart.error?.message } as DynamicResult, { status: 400 });
            }
        }
     
        return NextResponse.json({ status: "OK", msg: `Success delete Carts`, data: body.carts} as DynamicResult, { status: 200 });
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed delete carts", errorMessage: error} as DynamicResult, {status: 400});
    }
}