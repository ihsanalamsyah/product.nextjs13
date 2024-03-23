'use client'

import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from '../../../utils/cookies';
import moment from 'moment';
import { useRef } from 'react';

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

interface UserProduct {
    id: number;
    product_id: number;
    user_id: number;
    enroll_date: Date;
    Product: Product;
    User: User;
}

interface EnrollProduct{
    user: User;
    product: Product;
}


export default function ImageUploader(product: { productId: number }){

    const route = "http://localhost:4000/api";
    const productID = product.productId;
    async function handleFileChange (e: ChangeEvent<HTMLInputElement>){
        const token = getCookie("token");
       
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
                        'Authorization': 'Bearer '+ token
                    },
                    body: formData
                }); 


                const content = await response.json();
                const bufferObj = content.data;
                const uint8Array = new Uint8Array(bufferObj.data);
                const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
                const imageUrl = URL.createObjectURL(blob);
                // const content = await response.blob();
                // const imageUrl = URL.createObjectURL(content);
                // console.log(imageUrl);
                const imageProduct = document.getElementById(`image_product_${productID.toString()}`);
                if (imageProduct != null){
                    imageProduct.remove();
                }

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.setAttribute("id", `image_product_${productID.toString()}`);
                const container = document.getElementById('container');
                if (container) {
                    container.appendChild(imgElement);
                } else {
                    console.error("Elemen dengan ID 'container' tidak ditemukan");
                }
                
                return "OK";           
            }
        } catch (error){
            console.error(error);
        }
           
    };
    
    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Gambar</h2>
                <form method="post" encType="multipart/form-data">        
                    <input className="" id="file_input" onChange={(e)=>handleFileChange(e)} type="file" name="image" accept="image/*"/>          
                </form>
            </div>     

        </div>
        
    )
}