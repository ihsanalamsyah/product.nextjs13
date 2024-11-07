import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
                .from('products')
                .select()
        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error fetch product", errorMessage: error.message} as DynamicResult, {status: 400});
        }
        if(data.length <= 0){
            return NextResponse.json({status: "Failed", msg: "Product not exists", errorMessage: "Product not exists"} as DynamicResult, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: "Success get products", data: data} as DynamicResult, {status: 200});
    }
    catch (error) {
        return NextResponse.json({status: "Failed", msg: error, errorMessage: error} as DynamicResult, {status: 400});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:Products = await req.json();
        const price = body.price as number;
        const quantity = body.quantity as number;
        const title = body.title as string;
        const category = body.category as string;
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is not number"} as DynamicResult, {status: 400});
        }
        const resultAlreadyExists = await supabase
            .from('products')
            .select()
            .eq('title', body.title)
        if (resultAlreadyExists.data!.length! > 0){
            return NextResponse.json({status: "Failed",  msg: "Product already exist", data: resultAlreadyExists.data!} as DynamicResult, {status: 400});
        }
        const today = new Date();
        const dataProduct = {       
            category: category,  
            title: title,
            price: price,
            quantity: quantity,
            user_id: null,
            enroll_date: null,
            row_status: true,
            created_date: today
        }
        const { data, error }  = await supabase
            .from('products')
            .insert(dataProduct)
            .select()
        if(error != null){
            return NextResponse.json({ status: "Failed", msg: error.message, errorMessage: error.message } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "Product Created", data: data} as DynamicResult, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed POST Product", errorMessage: error} as DynamicResult, {status: 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        let price = body.price as number;
        let stringPrice:string = price.toString().replace(/\./g, '');
        price = Number(stringPrice);
        const quantity = body.quantity as number;
        const today = new Date();
        if (isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price NaN"} as DynamicResult, {status: 400});
        }
        const { data, error } = await supabase
            .from("products")
            .update({ title: body.title, price: price, quantity: quantity, row_status: true, updated_date: today})
            .eq("id", body.id)
            .select()

        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error update data"} as DynamicResult, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Updated`, data: data} as DynamicResult, {status: 200});
        
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed PATCH Product", errorMessage: error} as DynamicResult, {status: 400});
    }
}

export async function DELETE(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        const today = new Date();
        const deleteProduct = await supabase
            .from("products")
            .update({row_status: false, updated_date: today})
            .eq("id", body.id)

        if(deleteProduct.error != null){
            return NextResponse.json({status: "Failed", msg: "Error delete data", errorMessage: deleteProduct.error.message} as DynamicResult, {status: 400});
        }
        if(deleteProduct.count! <= 0 && deleteProduct.count != null){
            return NextResponse.json({status: "Failed", msg: "Product not exists", errorMessage: "Product not exists"} as DynamicResult, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} deleted`} as DynamicResult, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed delete product", errorMessage: error} as DynamicResult, {status: 300});
    }
}