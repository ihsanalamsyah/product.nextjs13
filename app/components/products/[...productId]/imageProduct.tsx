'use client'

import { ChangeEvent, useEffect} from "react";
import { getCookie } from '../../../../utils/cookies';

interface Product {
    id: number;
    title: string;
    price: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    password: string;
    role: string;
}

interface ImageProduct {
    productId: string;
    
}




export default async function ImageComponent({children, isAdmin, productId, token } : any){
    async function handleFileChange (e: ChangeEvent<HTMLInputElement>){
        const route = process.env.NEXT_PUBLIC_ROUTE;
        
        const formData = new FormData();
        try{
            
            const fileInput = e.target;
            const files = fileInput.files;
            
            if (files && files.length > 0) {
                const file = files[0];
                
                formData.append('image', file);
                formData.append('productId', productId.toString());
                const response = await fetch(`${route}/imageupload`, {
                    method: 'POST',
                    headers:{
                        'Authorization': 'Bearer '+ token
                    },
                    body: formData
                }); 
    
    
                const content = await response.json();
    
                if(content.status == "OK"){
                    const bufferObj = content.data;
                    const uint8Array = new Uint8Array(bufferObj.data);
                    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);


                    const imageProduct = document.getElementById(`image-product-${productId.toString()}`);
                    if (imageProduct != null){
                        imageProduct.remove();
                    }
    
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.setAttribute("id", `image-product-${productId.toString()}`);
                    imgElement.setAttribute("alt", `image product ${productId.toString()}`);
                    imgElement.setAttribute("class","object-cover");
                    const container = document.getElementById('container');
                    if (container != null) {
                        container.appendChild(imgElement);
                    } else {
                        console.error("Elemen dengan ID 'container' tidak ditemukan");
                    }
                }
                else{
                    alert(content.msg);
                }
                            
            }
        } catch (error){
            console.error(error);
        }
            
    };

  
    
    return (
        
        <>
        <div>{children}</div>
        {isAdmin ? (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                <form method="post" encType="multipart/form-data">        
                    <input className="" id="file_input" onChange={(e)=>handleFileChange(e)} type="file" name="image" accept="image/*"/>          
                </form>
            </div>   
        ):(
            <div className='hidden'>
                <h2 className="text-xl font-semibold mb-4">Non-Admin View</h2>
            </div>
        )}
        </>
        
    )
}