'use client'
import { useEffect } from "react";
export default function AlertSuccess(alertSuccess: Alert){
    
    const { visible, message, onClose, duration = 3000 } = alertSuccess;
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
    
            return () => {
                clearTimeout(timer);
            };
        }
    }, [visible, duration, onClose]);
    if(!visible){
        return null;
    }
    
    return (
        <> 
        <div role="alert" className="alert alert-success gap-0.5 lg:gap-1 p-2 lg:p-4">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
             <p className="lg:text-base text-xs">{message}</p>
             <div>
                <button className="text-black hover:text-white hover:bg-green-700 p-1 rounded-full" onClick={onClose}> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
             </div>
        </div> 
       </>
    )
}
