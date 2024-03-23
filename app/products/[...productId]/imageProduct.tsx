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

const route = "http://localhost:4000/api";

export default function ImageUploader(product: { productId: number }){

    const route = "http://localhost:4000/api";
    const productID = product.productId;
    
    async function handleLoadImage (){
        const token = getCookie("token");
       
        try{

            const imageProduct = document.getElementById(`image_product_${productID.toString()}`);
            if (imageProduct == null){
                const response = await fetch(`${route}/getimage`, {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify({
                        productId: productID.toString()      
                    })
                }); 
                
                const content = await response.json();
                const bufferObj = content.data;
                const uint8Array = new Uint8Array(bufferObj.data);
                const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
                const imageUrl = URL.createObjectURL(blob);
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;            
                imgElement.setAttribute("id", `image_product_${productID.toString()}`);
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
    
            } else{
                console.error("Image sudah ada");
            }
            

            // const content = await response.blob();
            // console.log(content);
            // const imageUrl = URL.createObjectURL(content);
            // console.log(imageUrl);
            // const imgElement = document.createElement('img');
            // imgElement.src = imageUrl;
            // const container = document.getElementById('container2');
            // if (container) {
            //     container.appendChild(imgElement);
            // } else {
            //     console.error("Elemen dengan ID 'container' tidak ditemukan");
            // }
            
            return "OK";
           
        }catch (error){
            console.error(error);
        }
        
        
    };
    
    return (
        <div>
            <button onClick={handleLoadImage}>Load Image</button>
           
        </div>
        
        
    )
}