import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';


export async function POST(req: NextRequest, res: NextResponse) {
    
    try {     
        const cookieStore = cookies();
        const { error } = await supabase.auth.signOut();
        if(error != null){
            return NextResponse.json({ status: "error", msg: "Error logout" }, { status: 400 });
        }
        cookieStore.delete("token");
        cookieStore.delete("email");
        return NextResponse.json({status: "OK", msg: "Success logout"}, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}