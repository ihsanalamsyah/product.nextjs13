'use server'
import Link from 'next/link';
import { cookies } from 'next/headers'
import { ChangeEvent } from 'react';
import DetailProduct from '@/app/components/products/[...product_id]/detailProduct'
import ImageComponent from '@/app/components/products/[...product_id]/imageProduct';
import { notFound } from "next/navigation";
import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function getImageUrl(token: string,  product_id: number){
  
    let imageUrl = "";
    try{

    }
    catch(error){
        console.error('Error fetching data:', error);
    }
    return imageUrl;
}

async function getProductById(token: string, product_id: number){
    let product: Products = {
       title: "",
       id: 0,
       price: 0
    };
    try {
        
        const response = await fetch(`${route}/productDetail?id=${product_id}`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'     
            }
        });

        const content = await response.json();
        product = content.data[0];

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    return product;
}

async function getUserByEmail(token:string, email:string){
    let user: Users = {
        name: "",
        password: "",
        email: "",
        gender: "",
        role: "",
        id: 0
     };
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
        user = content.data[0];

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    return user;
}

async function logout(token:string){
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
export default async function ProductDetail({params}: {params: {product_id: number}}){
    const getSession = await supabase.auth.getSession();
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const email = cookieStore.get('email');
    const product_id = Number(params.product_id);
    if (getSession.data.session == null){
        const isSuccessLogout = await logout(token!.value);
        if(isSuccessLogout){
            console.log("Gak ada session");
            //redirect('/');
        }
    }  
    
    if (product_id < 0  || isNaN(product_id)) {
      notFound();
    }
   
    let isAdmin = false;
    const user:Users = await getUserByEmail(token!.value, email!.value);
    if(user.role! == "Admin"){
        isAdmin = true;
    }
    const productDetail: Products = await getProductById(token!.value, params.product_id);
    const imageUrl = await getImageUrl(token!.value, params.product_id);
    const imageId = `image-product-${params.product_id}`;
    const imageAlt = `image product ${params.product_id}`;
    return(
        // <>
        // </>
        <div>
            {/* <ImageComponent isAdmin={isAdmin} product_id={params.product_id} token={token.value}> 
                <div className="flex">
                    <p>Image: </p>
                    <div id="container" className="d-flex rounded-full w-40 h-40 relative overflow-hidden">
                        <img className="object-cover" id={imageId} alt={imageAlt} src={imageUrl} />
                    </div>
                    
                </div>
            </ImageComponent> */}

            <br></br>

            <DetailProduct>
                <div className='flex justify-evenly'>
                    <p>Product title: {productDetail.title}</p>
                    <p>Product price: {productDetail.price}</p>   
                </div> 
            </DetailProduct>

            <br></br>
            <div className='flex justify-evenly'>
                <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>
                <p></p>
            </div>
            
        </div>
    )
}