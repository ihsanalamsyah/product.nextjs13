'use server'

import CardProduct from "@/app/components/products/cardProduct";
import WelcomeMessage from "@/app/components/products/welcomeMessage";
import Navbar from "@/app/components/products/navbar";
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export default async function Products(){
    
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? "";
    const email = cookieStore.get('email')?.value ?? "";
    let isAdmin = false;
    const users:Users[] = await GetUserDetail(token!, email!);
    if(users[0].role == "Admin"){
        isAdmin = true;
    }
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.error("Gak ada session");
        //return redirect('/');
    }
    return (
        //<></>
        <>
        <Navbar users={users} />
        <div className="py-10 px-10 mt-16">
            <div className="flex justify-center my-2">
                <WelcomeMessage name={users[0].name!} isAdmin={isAdmin}/>  
            </div> 
            <hr></hr>
            <div>
                <CardProduct users={users}/>
            </div>         
        </div> 
        </> 
    ) 
}