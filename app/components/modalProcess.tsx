'use client'

import { useEffect, useState } from "react";

export default function ModalProcess(modalProcess: ModalProcess){
    const [modal, setModal] = useState(false);

    function onChangeModal(){
        modalProcess.onProcessing(!modalProcess.isProcessing);
    }
    useEffect(()=>{    
        if(modalProcess.isProcessing){
            setModal(true);
        }else{
            setModal(false);
        }
    }, [modalProcess.isProcessing]);

    return (
        <> 
        
        <input type="checkbox" checked={modal} onChange={onChangeModal} className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
            <h3 className="font-bold text-lg">Processing</h3>
                <p className="py-4">Please wait it&apos;s processing...</p> 
            </div>
        </div>
        </>
    )
}
