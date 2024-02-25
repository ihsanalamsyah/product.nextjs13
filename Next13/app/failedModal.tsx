'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function FailedModal(){
    const [modal, setModal] = useState(false);
    const router = useRouter();

    function handleChange(){
        setModal(!modal);
    }
   
    return (
        <div>
            <button className="btn" onClick={handleChange}>Failed Modal</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />

            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Failed</h3>                                     
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleChange}>
                            Close
                        </button>                                                                  
                    </div>
                   
                </div>
            </div>

        </div>
    )
}