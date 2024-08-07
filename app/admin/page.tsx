'use server'

'use server'

import AddProduct from "@/app/components/products/addProduct";
import TableProduct from "@/app/components/products/tableProduct";
import WelcomeMessage from "@/app/components/products/welcomeMessage";
import Navbar from "@/app/components/navbar";
import { cookies } from "next/headers";
import { supabase } from '@/utils/supabase';

const route = process.env.NEXT_PUBLIC_ROUTE;


export default async function Admin(){
    
    const cookiesStore = cookies();
    const token = cookiesStore.get("token");
    const email = cookiesStore.get("email");
    const category = cookiesStore.get("category");
    let isAdmin = true;
    async function getUserDetail(token: string, email: string){
        let user: Users[] = [{
            id: 0,
            name: "",
            email: "",
            password: "",
            gender: "",
            role: ""
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
    
    async function logout(token: string){
        let isSuccessLogout = false;
        try{
            const response = await fetch(`${route}/logout`,{
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+ token,
                    'Content-Type': 'application/json'
                }
            });
            const content = await response.json();
            if(content.status == "OK"){
                isSuccessLogout = true;
            }
        }catch(error) {
            console.error('Error fetching data:', error);
        }
        return isSuccessLogout;
    }
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.log("Gak ada session");
        // const isSuccessLogout = await logout(token!.value);
        // if(isSuccessLogout){
        //     console.log("Gak ada session");
        //     //redirect('/');
        // }
    }
    const users:Users[] = await getUserDetail(token!.value, email!.value);
    if(users[0].role == "Admin"){
        isAdmin = true;
    }
    
    return (
        <>
        <Navbar category={category!.value}/>
        <div className="py-10 px-10 mt-16">
            <div className="flex justify-center my-2">
                <WelcomeMessage name={users[0].name!} isAdmin={isAdmin} />
            </div> 
            <div className="py-2 flex">
                <AddProduct isVisible={isAdmin}/>
            </div>
            <hr></hr>
            <div>
                <TableProduct />  
            </div>         
        </div> 
        </>
        
    )

    
}