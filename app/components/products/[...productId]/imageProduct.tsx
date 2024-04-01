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
async function getImage(token: string | null | undefined,  productId: string){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    let imageUrl = "";
    try{
        const response = await fetch(`${route}/getimage`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJiYXJ1QG1haWwuY29tIiwibmFtZSI6InVzZXIgYmFydSIsImlhdCI6MTcxMTkwMjE0MX0.C3etg6JJxb9IJ1lOfOgcjSOO3dVpyyMChfxYATYWu2Y"
            },
            body: JSON.stringify({
                productId: productId   
            })
        }); 
        
        const content = await response.json();
        if(content.status == "OK"){
            const imageProduct = document.getElementById(`image_product_${productId}`);
            if (imageProduct != null){
                imageProduct.remove();
            }

            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.setAttribute("id", `image_product_${productId}`);
            imgElement.setAttribute("alt", `image product ${productId}`);
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
    catch(error){
        console.error('Error fetching data:', error);
    }
}

export default async function ImageComponent(imageProduct: ImageProduct){

    const route = process.env.NEXT_PUBLIC_ROUTE;
    const productID = imageProduct.productId;
    const token = "asd";
    //const token = getCookie('token');
    //const role = getCookie('role');
    let isAdmin = false;
   

    async function handleFileChange (e: ChangeEvent<HTMLInputElement>){

        const formData = new FormData();
        try{
           
            const fileInput = e.target;
            const files = fileInput.files;
           
            if (files && files.length > 0) {
                const file = files[0];
               
                formData.append('image', file);
                formData.append('productId', productID.toString());
                const response = await fetch(`${route}/imageupload`, {
                    method: 'POST',
                    headers:{
                        'Authorization': 'Bearer '+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJiYXJ1QG1haWwuY29tIiwibmFtZSI6InVzZXIgYmFydSIsImlhdCI6MTcxMTkwMjE0MX0.C3etg6JJxb9IJ1lOfOgcjSOO3dVpyyMChfxYATYWu2Y"
                    },
                    body: formData
                }); 


                const content = await response.json();

                if(content.status == "OK"){
                    const bufferObj = content.data;
                    const uint8Array = new Uint8Array(bufferObj.data);
                    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
                    const imageUrl = URL.createObjectURL(blob);
                    const imageProduct = document.getElementById(`image_product_${productID.toString()}`);
                    if (imageProduct != null){
                        imageProduct.remove();
                    }
    
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.setAttribute("id", `image_product_${productID.toString()}`);
                    imgElement.setAttribute("alt", `image product ${productID.toString()}`);
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

    await getImage(token, productID);
    return (
        <div className="flex">
            <p>Image: </p>
            <div id="container" className="d-flex rounded-full w-40 h-40 relative overflow-hidden">            
            </div>
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
        </div>
        
        
    )
}