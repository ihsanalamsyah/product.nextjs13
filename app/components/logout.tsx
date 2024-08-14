'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from '@/utils/cookies';
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

export default function Logout(logout: Logout){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const router = useRouter();
    const token = getCookie("token");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
  
    async function handleLogout(){
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            logout.handleChangeLogout
            deleteCookie("token");
            deleteCookie("email");
            deleteCookie("category");
            return router.push("/");
        }
        else{       
            logout.handleChangeLogout
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
            return router.push("/products");   
        }
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    return (
        <>
        <input type="checkbox" checked={logout.modalLogout} onChange={logout.handleChangeLogout} className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Are you sure to logout?</h3>    
                {alertStatus == "Failed" ? (
                    <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>         
                ): (
                    <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
                )}                                  
                <div className="modal-action">
                    <button type="button" className="btn" onClick={logout.handleChangeLogout}>
                        Close
                    </button>
                    <button type="button" onClick={handleLogout} className="btn btn-primary">
                        Yes
                    </button>                                                       
                </div>
            </div>
        </div>
        </>
    )
}