'use server'

import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';
import Navbar from "@/app/components/products/navbar";
import CartComponent from "@/app/components/products/cartComponent";
import { cookies } from 'next/headers';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetUserDetail(token: string, email: string):Promise<Users[]>{
    let user: Users[] = [];    
    try {             
        const response = await fetch(`${route}/userDetail`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const content = await response.json();
        
        user = content.data;
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return user;
}
export default async function Cart(){
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.error("Gak ada session");
        //return redirect('/');
    }
    
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? "";
    const email = cookieStore.get('email')?.value ?? "";
    const users:Users[] = await GetUserDetail(token!, email!);
    return (
        <>
        <Navbar users={users} />
        <div className="py-10 px-10 mt-16">
            <CartComponent />
        </div>
        </>
    )
}

