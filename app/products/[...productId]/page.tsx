'use client'

import Link from 'next/link';
import { getCookie } from '../../../utils/cookies';
import ImageUploader from './imageUploader';

interface Product {
    id: number;
    title: string;
    price: number;
}

interface GetProduct {
    status: string;
    msg: string;
    data: Product;
    
}

async function getProductById(token: string | null | undefined, productId: string){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    try {
               
        const response = await fetch(`${route}/product`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: productId
            })
        });
       
        const content = await response.json();
        
        return content;
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}

async function getImage(token: string | null | undefined,  productId: string){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    try{
        const response = await fetch(`${route}/getimage`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                productId: productId.toString()      
            })
        }); 
        
        const content = await response.json();
        const bufferObj = content.data;
        const uint8Array = new Uint8Array(bufferObj.data);
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
        const imageUrl = URL.createObjectURL(blob);
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;            
        imgElement.setAttribute("id", `image_product_${productId.toString()}`);
        const container = document.getElementById('container');
        
        if (container != null) {
            // const imageProduct = document.getElementById(`image_product_${productID.toString()}`);
            // if(imageProduct != null){
            //     imageProduct.remove();        
            // }
            container.appendChild(imgElement);         
        } else {
            console.error("Elemen dengan ID 'container' tidak ditemukan");
        }
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
}

export default async function ProductDetail({params}: {params: {productId: string}}){
    const token = getCookie("token");
    const role = getCookie("role");
    let isAdmin = false;
    if(role == "Admin"){
        isAdmin = true;
    }
    //ini pembuat load data terus
    const getProduct: GetProduct = await getProductById(token, params.productId[0]);
    await getImage(token, params.productId[0]);
    return(
        <div>
            <p>Product id number: {getProduct.data.id}</p>
            <p>Product title: {getProduct.data.title}</p>
            <p>Product price: {getProduct.data.price}</p>
            {isAdmin ? (
                <ImageUploader productId={getProduct.data.id}/>
                ):(
                <div></div>
            )}
            {/* <ImageProduct productId={getProduct.data.id}/> */}
            <p>Image: </p>
            <div id="container" className="d-flex">

            </div> 
            <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>         
        </div>
    ) 
}