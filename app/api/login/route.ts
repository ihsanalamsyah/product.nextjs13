import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:Users = await req.json();
       
        let signInPassword = await supabase.auth.signInWithPassword({
            email: body.email!,
            password: body.password!
        })
        if (signInPassword.error != null) {
            return NextResponse.json({ status: "Failed", msg: "Error sign in with pass", errorMessage: signInPassword.error.message }, { status: 400 });
        }
        let users = await supabase
            .from("users")
            .select()
            .eq('email', body.email)
            .limit(1)
        if(users.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch user", errorMessage: users.error.message }, { status: 400 });
        }
        if(users.data.length <= 0){
            return NextResponse.json({ status: "Failed", msg: "User is not exists or fetch error"}, { status: 400 });
        }
        const dataUser: Users = {
            id:  users.data![0].id,
            name:  users.data![0].name,
            password:  users.data![0].password,
            role: users.data![0].role,
            email: users.data![0].email,
            gender: users.data![0].gender,
            phone: users.data![0].phone,
        }
        const result = {
            user: dataUser,
            token: signInPassword.data.session.access_token
        }
        return NextResponse.json({status: "OK", msg: "Success login, redirecting to dashboard", data: result} as DynamicResult, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Login", errorMessage: error} as DynamicResult, {status: 400});
    }
}