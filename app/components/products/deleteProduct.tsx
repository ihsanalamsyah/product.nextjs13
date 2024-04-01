'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from '../../../utils/cookies';

type Product = {
    id: number;
    title: string;
    price: number;
}

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function DeleteProduct(product: Product){
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
    }
    
    async function handleDelete(productId: number){
    
    setIsMutating(true);
    const response = await fetch(`${route}/products/${productId}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        },
    });
    const content = await response.json();
    if(content.status == "OK"){
        setIsMutating(false);
        router.refresh();
        setModal(false);
    }
    else{
        setIsMutating(false);
        router.refresh();
        setModal(false);
        alert(content.msg);
    }
   
    }
    return (
        <div>
            <button className="btn btn-error btn-sm" onClick={handleChange}> Delete</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />


            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure to delete {product.title}?</h3>
                                        
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            {!isMutating ? (
                            <button type="button" onClick={()=> handleDelete(product.id)} className="btn btn-primary">
                                Delete
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Deleting...
                            </button>
                            )}
                           
                          
                        </div>
                
                </div>
            </div>

        </div>
    )
}