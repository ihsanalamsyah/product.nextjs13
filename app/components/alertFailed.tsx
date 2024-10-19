'use client'

import { useState } from "react";
export default function AlertFailed(alertFailed: Alert){
    
    const [message, setMessage] = useState(alertFailed.message)
   
    if(!alertFailed.visible){
        return null;
    }
    return (
        <> 
        <div role="alert" className="alert alert-error gap-0.5 lg:gap-1 p-2 lg:p-4">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-6 w-6 shrink-0 stroke-current"
               fill="none"
               viewBox="0 0 24 24">
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth="2"
                 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p className="lg:text-base text-xs">{message}</p>
             <div>
                 <button className="btn lg:btn-sm btn-xs" onClick={alertFailed.onClose}>Close</button>
             </div>
        </div>
        </>
    )
}
