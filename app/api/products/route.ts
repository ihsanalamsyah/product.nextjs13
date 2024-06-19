import { NextResponse, NextRequest } from "next/server";

import Product from '../models/productModel';

export async function GET() {
    try {
        const response = await Product.findAll();
        return NextResponse.json({status: "OK", msg: "Get Product", data: response});
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        var body = await req.json();
        var price = body.price;
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is NaN"});
        }
        
        await Product.create(body);
        return NextResponse.json({status: "OK", msg: "Product Created"});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "error"});
    }
}