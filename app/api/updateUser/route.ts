import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:ResetPassword = await req.json();
        if(body.password != body.confirmPassword){
            return NextResponse.json({status: "Failed", msg: "Password, Confirm Password is different"}, {status: 400}); 
        }
        const authHeader = req.headers.get("authorization")!;
        const token = authHeader.split(" ")[1];
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value ?? "";
        const setSession = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refreshToken
        })
        if(setSession.error != null){
            return NextResponse.json({status: "Failed", msg: "Failed set session", errorMessage: setSession.error}, {status: 400});
        }
        const updateUser = await supabase.auth.updateUser({
            password: body.password
        })
        if(updateUser.error != null){
            return NextResponse.json({status: "Failed", msg: "Failed update user", errorMessage: updateUser.error}, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: "Success update user"}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}