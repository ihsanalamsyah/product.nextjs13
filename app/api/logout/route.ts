import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';


export async function POST(req: NextRequest, res: NextResponse) {
    
    try {
        const { error } = await supabase.auth.signOut();
        if(error != null){
            return NextResponse.json({ status: "error", msg: "Error logout" } as DynamicResult, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "Success logout"} as DynamicResult, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Logout", errorMessage: error} as DynamicResult, {status: 400});
    }
}