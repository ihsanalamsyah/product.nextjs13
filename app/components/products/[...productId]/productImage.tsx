'use client'

import { ChangeEvent } from "react";
import { getCookie } from '../../../../utils/cookies';
import Image from 'next/image';

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


interface ProductImage{
    productId: number,
    imageUrl: string
}



export default async function ProductImage( productImage: ProductImage){

    
    const imageProduct = document.getElementById(`image_product_${productImage.productId}`);
    if (imageProduct != null){
        imageProduct.remove();
    }

    const imgElement = document.createElement('img');
    imgElement.src = productImage.imageUrl;
    imgElement.setAttribute("id", `image_product_${productImage.productId}`);
    imgElement.setAttribute("alt", `image product ${productImage.productId}`);
    imgElement.setAttribute("class","object-cover");
    const container = document.getElementById('container');
    if (container != null) {
        container.appendChild(imgElement);
    } else {
        console.error("Elemen dengan ID 'container' tidak ditemukan");
    }
    return (
        <>
           <div id="container" className="d-flex rounded-full w-40 h-40 relative overflow-hidden">
                    
            </div>
        </>
        
        
    )
}