'use client'

export default function AlertSuccess(alertSuccess: Alert){
    
    if(!alertSuccess.visible){
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
             <p className="lg:text-base text-xs">{alertSuccess.message}</p>
             <div>
                 <button className="btn btn-sm" onClick={alertSuccess.onClose}>Close</button>
             </div>
        </div> 
       </>
    )
}
