'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
        const response = await fetch(`${route}/mapUserProduct`,{
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
            <button className="btn btn-info btn-sm mx-1 w-max" onClick={handleChange}>Enroll Now</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are You Sure to Enroll This {enrollProduct.product.title} ?</h3>                                      
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            {!isMutating ? (
                            <button type="button" onClick={()=> handleEnroll(enrollProduct.product.id!, enrollProduct.user.id!)} className="btn btn-primary">
                                Enroll
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Enrolling...
                            </button>
                            )}                                         
                        </div>              
                </div>
            </div>

        </div>
    )
}