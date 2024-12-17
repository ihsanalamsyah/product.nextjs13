'use client'

import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

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
export default function BackToDashboard(backToDashboard: BackToDashboard){
    const [users, setUsers] = useState<Users[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    
    useEffect(()=>{
        const fetchData =  async ()=>{
            const token = getCookie("token");
            const email = getCookie("email");
            const users:Users[] = await GetUserDetail(token!, email!);
            setUsers(users);
            if(users[0].role == "Admin"){
                setIsAdmin(true);
            }
        }
        fetchData();
    }, []);

    function handleBackDashboard(){
        if(isAdmin){
            return router.push("/admin");
        }else{
            if(backToDashboard.category == "handphone"){
                return router.push("/products?category=handphone");
            }else{
                return router.push("/products?category=video");
            }   
        } 
    }

    return (
        <>
        {backToDashboard.category == "video" ? (
            <a onClick={handleBackDashboard}><button className="btn btn-sm btn-outline">&lt; Back To Dashboard</button></a>
        ) : (
            <a onClick={handleBackDashboard}><button className="btn btn-sm btn-outline btn-neutral">&lt; Back To Dashboard</button></a>
        )}    
        </>
    )
}