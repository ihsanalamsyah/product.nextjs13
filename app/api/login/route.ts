import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body:Users = await req.json();
       
        let { data, error } = await supabase.auth.signInWithPassword({
            email: body.email!,
            password: body.password!
        })
        if (error != null) {
            return NextResponse.json({ status: "Failed", msg: "Error sign in with pass", errorMessage: error?.message }, { status: 400 });
        }
        let user = await supabase
            .from("users")
            .select()
            .eq('email', body.email)
            .limit(1)
        if(user.error != null){
            return NextResponse.json({ status: "Failed", msg: "Error fetch user", errorMessage: user.error?.message }, { status: 400 });
        }
        if(user.data.length <= 0){
            return NextResponse.json({ status: "Failed", msg: "User is not exists or fetch error"}, { status: 400 });
        }
        const dataUser: Users = {
            id:  user.data![0].id,
            name:  user.data![0].name,
            password:  user.data![0].password,
            role: user.data![0].role,
            email: user.data![0].email,
            gender: user.data![0].gender,
            phone: user.data![0].phone,
        }
        return NextResponse.json({status: "OK", msg: "Success login", data: dataUser, token: data.session?.access_token}, {status: 200});
             
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "Failed Login", errorMessage: error as string}, {status: 400});
    }
}