'use client'

import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';
const route = process.env.NEXT_PUBLIC_ROUTE;

export default function FormResetPassword(resetPassword: ContentToogle){
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isMutating, setIsMutating] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const router = useRouter();

    function resetForm(){
        setPassword("");
        setConfirmPassword("");
    }
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    const refreshToken = params.get("refresh_token")!;
    setCookie("refreshToken", refreshToken, 7);
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true); 
        const response = await fetch(`${route}/updateUser`,{
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token ,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
                confirmPassword: confirmPassword
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            return router.push("/");
        }
        else{            
            setIsMutating(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
        }
        
    }

    function handleShowPassword(e: ChangeEvent<HTMLInputElement>){
        const checkbox = e.target.checked;
        if(checkbox){
            setIsShowPassword(true);
        }else{
            setIsShowPassword(false);
        }
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    function handleForgotPassword(){
        router.push(`/`);
    }
    return (
        <>
            <h1 className="lg:text-4xl text-xl text-white">Reset Password</h1>
            <h1 className="text-white my-1 lg:text-base text-xs">Update Your Password Correctly :</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control my-2">
                {isShowPassword ? (
                    <input
                        type="text" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="New Password" />          
                    ) : (
                    <input
                        type="password" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="New Password" />
                    )}
                </div>                      
                <div className="form-control my-2">
                    {isShowPassword ? (
                    <input
                        type="text" 
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="Confirm Password" />          
                    ) : (
                    <input
                        type="password" 
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="Confirm Password" />
                    )}
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
                    <div>
                        <label className="label cursor-pointer lg:px-1 lg:py-1 px-1 py-0">                
                            <input type="checkbox" className="checkbox mx-1 lg:checkbox-sm checkbox-xs show-password-signin border-white [--chkbg:white] [--chkfg:green]" onChange={handleShowPassword}/>
                            <p className="mx-1 text-white lg:text-base text-xs">Show Password</p>
                        </label>
                    </div>
                </div>
            </form>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
        </>
    )
}