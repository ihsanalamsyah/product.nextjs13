'use client'

import { useState, SyntheticEvent, ChangeEvent } from "react";
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function ResetPassword(resetPassword: ContentToogle){
    const [email, setEmail] = useState("");
    const [isMutating, setIsMutating] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    function resetForm(){
        setEmail("");
    }
   
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/resetPassword`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();         
        }
        else{            
            setIsMutating(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
        }
        
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    function handleHomePage(){
        resetPassword.onToogle();
    }
    return (
        <>
            <h1 className="lg:text-4xl text-xl text-white">Reset Password.</h1>
            <h1 className="text-white my-1 lg:text-base text-xs">Please Enter Email Correctly :</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control my-2">
                <input
                    type="text" 
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    className="input lg:input-md input-sm w-full max-w-lg" 
                    placeholder="Email" />          
                    
                </div>                      
                <div className="flex justify-between my-2">
                    <div>
                        {!isMutating ? (
                        <button type="submit" className="btn btn-success lg:btn-sm btn-xs lg:px-6 lg:pb-6 lg:pt-2 text-white">
                            Submit
                        </button>
                        ) : (
                        <button type="button" className="btn loading lg:btn-sm btn-xs lg:px-6 lg:pb-6 lg:pt-2 text-white">
                            Submit...
                        </button>
                        )}       
                    </div>
                </div>
            </form>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
            <div className="my-1">
                <p className="text-white lg:text-base text-xs">Click <a className="hover:underline text-blue-300 cursor-pointer" onClick={handleHomePage}>here</a> to go back to the homepage.</p>
            </div>
        </>
    )
}