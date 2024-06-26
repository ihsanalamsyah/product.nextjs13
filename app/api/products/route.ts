import { NextResponse, NextRequest } from "next/server";

import Product from '../models/productModel';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');
        let response;
        if(id != null){
            response = await Product.findOne({
                where: {
                    id: id
                }
            });
            return NextResponse.json({status: "OK", msg: `Get Product ${id}`, data: response});
        }
        else{
            response = await Product.findAll({
                order:[
                    ['title', 'asc']
                ]
            });
            return NextResponse.json({status: "OK", msg: `Get Product`, data: response});
        }

        
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        var body:Products = await req.json();
        var price = body.price;
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is not number"}, {status: 400});
        }
        const product = await Product.findOne({
            where: {
                title: body.title.trim()
            }
        });
        if(product != null){
            return NextResponse.json({status: "Failed", msg: "product already exists"}, {status: 400});
        }
        const data = {         
            title: body.title,
            price : price,
            rowStatus: true
        }
        await Product.create(data);
        return NextResponse.json({status: "OK", msg: "Product Created"}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "error"}, {status: 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse){
    try {
        var body:Products = await req.json();
        var price = body.price;
        const data = {         
            title: body.title,
            price : price,
            rowStatus: true
        }
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is NaN"}, {status: 400});
        }       
        await Product.update(data,{
            where: {
                id: id
            }
        });
        return NextResponse.json({status: "OK", msg: `Product ${id} Updated`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}

export async function DELETE(req: NextRequest, res: NextResponse){
    try {
        var body:Products = await req.json();
        const product = await Product.findOne({
            where: {
                id: body.id
            }
        });
        product?.set({
            rowStatus: false
        })
        await product?.save();
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Deleted`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}