'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from '@/utils/cookies';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function DeleteProduct(product: EditProduct){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
    }
    
    async function handleDelete(product_id: number){
        setIsMutating(true);
        const response = await fetch(`${route}/products`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                id: product_id
                
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            product.onUpdateTable();
            setModal(false);
        }
        else{
            setIsMutating(false);
            alert(content.msg);
        }
   
    }
    return (
        <div>
            <button className="btn btn-error btn-sm mx-1 w-max" onClick={handleChange}> Delete</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">
                        Are you sure delete {product.title}?
                    </h3>
                    
                    <div className="modal-action mt-6 flex justify-end space-x-2">
                        <button 
                            type="button" 
                            className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                            onClick={handleChange}
                        >
                            Close
                        </button>
                        {!isMutating ? (
                            <button 
                                type="button" 
                                onClick={() => handleDelete(product.id!)} 
                                className="btn bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Yes
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn bg-red-600 text-white px-4 py-2 rounded-md loading"
                            >
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}