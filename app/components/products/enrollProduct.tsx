'use client'

import { useState } from "react";
import { getCookie } from '@/utils/cookies';

const route = process.env.NEXT_PUBLIC_ROUTE;

async function storeToCart(token:string, product_id: number, email:string,):Promise<boolean>{
    let result:boolean = false;
    try {
        const response = await fetch(`${route}/storeToCart`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                email: email,
                product_id: product_id,
                quantity: 1
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            result = true;
        }
        else{
            alert(content.msg);
        }
    } catch (error) {
        console.error('Error store to cart data:', error);
    }
    return result;

}
export default function EnrollProduct(enrollProduct: EnrollProduct){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    function handleChange(){
        setModal(!modal);
    }
    async function handleEnroll(productID:number){
        const token = getCookie("token")!;
        const email = getCookie("email")!;
        setIsMutating(true);
        const isEnroll:boolean = await storeToCart(token, productID, email);
        setIsMutating(false);
        setModal(false);
    }

    return (
        <div>
            <button className="btn btn-success lg:btn-sm btn-xs mx-1 w-max" onClick={()=> handleEnroll(enrollProduct.product.id!)}>+ Cart</button>
        </div>
    )
}