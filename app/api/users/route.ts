import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function GET() {
    try {
        let result:Users[] = [];
        const { data, error } = await supabase
            .from('users')
            .select("*")
        if(error != null){
            return NextResponse.json({ status: "error", msg: error.message, errorMessage: error.message} as DynamicResult, { status: 400 });
        }
        result = data;
        return NextResponse.json({status: "OK", msg: "Get all user", data: result} as DynamicResult, {status: 200});
    }
    catch(error) {
        return NextResponse.json({status: "Failed", msg: "Failed get user", errorMessage: error} as DynamicResult, {status: 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse){
    try {
        const body:Users = await req.json();
        const phone = body.phone as number;
        const name = body.name;
        const today = new Date();
        if (isNaN(phone)){
            return NextResponse.json({status: "Failed", msg: "Phone is NaN", errorMessage: "Phone is NaN"} as DynamicResult, {status: 400});
        }
        const { data, error } = await supabase
            .from("users")
            .update({ phone: phone, name: name, row_status: true, updated_date: today})
            .eq("id", body.id)
            .select()

        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error update data", errorMessage: error.message} as DynamicResult, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: `User ${body.id} updated`, data: data} as DynamicResult, {status: 200});   
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed patch user", errorMessage: error} as DynamicResult, {status: 400});
    }
}
