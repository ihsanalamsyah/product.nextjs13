'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from '@/utils/cookies';
import moment from 'moment';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function EnrollProduct(enrollProduct: EnrollProduct){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    const router = useRouter();
    function handleChange(){
        setModal(!modal);
    }
    async function handleEnroll(product_id: number, user_id: number){
    
        setIsMutating(true);
        let today = new Date();
        let formattedToday = moment(today).format('YYYY-MM-DD');
        const response = await fetch(`${route}/getAllProductUser`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                user_id: user_id,
                product_id: product_id,     
                enroll_date: formattedToday  
            })
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
            <button className="btn btn-info lg:btn-sm btn-xs mx-1 w-max" onClick={handleChange}>Enroll Now</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-lg">
                        Are you sure enroll this {enrollProduct.product.title} ?
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
                            onClick={()=> handleEnroll(enrollProduct.product.id!, enrollProduct.user.id!)}
                            className="btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                            Yes
                        </button>
                        ) : (
                        <button 
                            type="button" 
                            className="btn bg-blue-600 text-white px-4 py-2 rounded-md loading"
                        >
                            Enrolling...
                        </button>
                        )}                                         
                    </div>              
                </div>
            </div>

        </div>
    )
}