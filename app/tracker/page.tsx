'use server'

import Drawer from "@/app/components/products/drawer";
import { cookies } from 'next/headers';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default async function Tracker() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value ?? "";
  const email = cookieStore.get('email')?.value ?? "";
  async function getUserDetail(token: string, email: string){
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
  const users:Users[] = await getUserDetail(token!, email!);
    return (
      <>
        <div>
          <Drawer users={users}/>  
        </div>     
      </>
    );
  }