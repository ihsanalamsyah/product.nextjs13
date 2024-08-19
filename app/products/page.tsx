'use server'

import AddProduct from "../components/products/addProduct";
import TableProduct from "../components/products/tableProduct";
import WelcomeMessage from "../components/products/welcomeMessage";
import Navbar from "@/app/components/products/navbar";
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default async function Products(){
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? "";
    const email = cookieStore.get('email')?.value ?? "";
    let isAdmin = false;
    async function getUserDetail(token: string, email: string){
        let user: Users[] = [{
            id: 0,
            name: "",
            email: "",
            password: "",
            gender: "",
            role: "",
            phone: 0
        }];    
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
   
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.log("Gak ada session");
    }
    const users:Users[] = await getUserDetail(token!, email!);
    if(users[0].role == "Admin"){
        isAdmin = true;
    }
    return (
        //<></>
        <>
        <Navbar users={users} />
        <div className="py-10 px-10 mt-16">
            <div className="flex justify-center my-2">
                <WelcomeMessage name={users[0]?.name!} isAdmin={isAdmin} />
            </div> 
            <div className="py-2 flex">
                <AddProduct isVisible={isAdmin}/>
            </div>
            <hr></hr>
            <div>
                <TableProduct users={users}/>
            </div>         
        </div> 
        </>
        
    )

    
}