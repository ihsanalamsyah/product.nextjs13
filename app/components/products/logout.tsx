'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, deleteLocalStorage } from '@/utils/cookies';


export default function Logout(){
    const [modal, setModal] = useState(false);
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const router = useRouter();
    function handleChange(){
        setModal(!modal);
    }
    async function handleLogout(){
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            setModal(false);
            return router.push("/");
        }
        else{       
            setModal(false);
            alert(content.msg);
            return router.push("/products");
           
        }
        
    }
   
    
    return (
        <div>
            <button className="btn mx-2" onClick={handleChange}>Logout</button>
            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure to logout?</h3>
                                        
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            <button type="button" onClick={()=> handleLogout()} className="btn btn-primary">
                                Yes
                            </button>
                                                                             
                        </div>
                
                </div>
            </div>
        </div>
    )
}