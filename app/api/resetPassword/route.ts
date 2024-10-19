import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const routeRedirect = process.env.ROUTE_REDIRECT;
        const body:ResetPassword = await req.json();
        const user = await supabase
            .from("users")
            .select()
            .eq("email", body.email)
            .eq("row_status", true)
            .limit(1)
        if(user.error != null){
            return NextResponse.json({status: "Failed", msg: "Email not exists"}, {status: 404});
        }
        const resetPassword = await supabase.auth.resetPasswordForEmail(user.data[0].email, {
            redirectTo: `${routeRedirect}/resetpassword`,
        })
        if(resetPassword.error != null){
            return NextResponse.json({status: "Failed", msg: "Failed redirect"}, {status: 404});
        } 
        return NextResponse.json({status: "OK", msg: "Success Check Email for Reset Password"}, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}