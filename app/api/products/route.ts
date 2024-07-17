import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
import Product from '@/app/api/models/productModel';

export async function GET() {
    let result:DynamicResult =  {
        status: "",
        msg: "",
        errorMessage: "",
        data: []
    }
    try {
        const {data, error} = await supabase
                .from('products')
                .select()
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
        result.msg = "Success get Products";
        result.data = data;
        return NextResponse.json(result,{ status: 200 } );
    }
    catch {
        result.status = "Failed";
        result.msg = "Error";
        return NextResponse.json(result);
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:Products = await req.json();
        const price = body.price as number;
        const title = body.title as string;
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is not number"}, {status: 400});
        }
        const resultAlreadyExists = await supabase
            .from('products')
            .select()
            .eq('title', body.title)
        if (resultAlreadyExists.data!.length! > 0){
            return NextResponse.json({status: "Failed",  msg: "product already exist", data: resultAlreadyExists.data!}, {status: 400});
        }
        const today = new Date();
        const dataProduct = {         
            title: title,
            price : price,
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
            return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "Product Created", data: data}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "error"}, {status: 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        const price = body.price as number;
        const today = new Date();
        if (isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is NaN"}, {status: 400});
        }
        const { data, error } = await supabase
            .from("products")
            .update({ title: body.title, price: price, row_status: true, updated_date: today})
            .eq("id", body.id)
            .select()

        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error update data"}, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Updated`, data: data}, {status: 200});
        
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}

export async function DELETE(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        const today = new Date();
        const { data, error, count } = await supabase
            .from("products")
            .update({row_status: false, updated_date: today})
            .eq("id", body.id)

        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error delete data"}, {status: 400});
        }
        if(count! <= 0 && count != null){
            return NextResponse.json({status: "Failed", msg: `Data is not exists`}, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Deleted`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}