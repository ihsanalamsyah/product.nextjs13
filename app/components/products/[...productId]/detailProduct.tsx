'use client'

import Link from 'next/link';
import { getCookie } from '../../../../utils/cookies';
import { useState, useEffect } from "react";

interface Product {
    id: number;
    title: string;
    price: number;
}

interface DetailProduct {
    productId: string;
    
}
interface GetProduct {
    status: string,
    msg: string,
    data: Product  
}

async function getProductById(token: string | null | undefined, productId: string){
    const route = process.env.NEXT_PUBLIC_ROUTE;
   
    // try {
               
    //     const response = await fetch(`${route}/product`, {
    //         method: 'POST',
    //         headers:{
    //             'Authorization': 'Bearer '+ token,
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             id: productId
    //         })
    //     });
       
    //     const content = await response.json();

    //     return content;
        
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
}




export default async function DetailProduct(detailProduct: DetailProduct){
    const [productId, setProductId] = useState(0);
    const [productTitle, setProductTitle] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [token, setToken] = useState("");

    useEffect(() =>{
        const tokenEffect = getCookie("token") as string;
        setToken(tokenEffect);
       
    }, []);
    console.log(token);
    await getProductById(token, detailProduct.productId);

    // const getProduct: GetProduct = await getProductById(token, detailProduct.productId);
    // if(getProduct != null){
    //     setProductId(0);
    //     setProductTitle("asd");
    //     setProductPrice(0);
    // }
    return(
        <div>
            <p>Product id number: {productId}</p>
            <p>Product title: {productTitle}</p>
            <p>Product price: {productPrice}</p>    
        </div>
    )
}