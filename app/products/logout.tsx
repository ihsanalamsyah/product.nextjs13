'use client'

import { useState, SyntheticEvent, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from '../../utils/cookies';



export default function Logout(){
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    function handleChange(){
        setModal(!modal);
    }
    function handleLogout(){
        return router.push(`/`);
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