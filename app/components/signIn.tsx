'use client'

import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function SignIn(signIn: ContentToogle){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isMutating, setIsMutating] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const router = useRouter();

    function resetForm(){
        setEmail("");
        setPassword("");
    }
   
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setCookie("token", content.token, 7);
            setCookie("email", content.data.email, 7);
            setCookie("category", "Video", 7);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            return router.push("/products?category=Phone");
        }
        else{            
            setIsMutating(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            return router.push("/");
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

    function handleClickSignUp(){
        signIn.onToogle();
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    return (
        <>
            <h1 className="text-4xl text-white">Sign-In.</h1>
            <h1 className="text-white my-1">Please Enter Your Email and Password Correctly :</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control my-2">                      
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className="input input-md w-full max-w-lg"  
                        placeholder="Email"/>
                </div>                      
                <div className="form-control my-2">
                    {isShowPassword ? (
                    <input
                        type="text" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input input-md w-full max-w-lg" 
                        placeholder="Password" />          
                    ) : (
                    <input
                        type="password" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input input-md w-full max-w-lg" 
                        placeholder="Password" />
                    )}
                </div>
                <div className="flex justify-between my-2">
                    <div>
                    {!isMutating ? (
                        <button type="submit" className="btn btn-success btn-sm px-6 pb-6 pt-2 text-white">
                            Continue
                        </button>
                        ) : (
                        <button type="button" className="btn loading btn-sm px-6 pb-6 pt-2text-white">
                            Continue...
                        </button>
                        )}       
                    </div>
                    <div>                 
                        <label className="label cursor-pointer">                
                            <input type="checkbox" className="checkbox mx-1 show-password-signin border-white [--chkbg:white] [--chkfg:green]" onChange={handleShowPassword}/>
                            <span className="label-text mx-1 text-white">Show Password</span>
                        </label>
                    </div>                         
                </div>
            </form>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
            <div className="my-1">
                <p className="text-white">If you don&#39;t have Account yet, Please <a className="underline text-blue-300 cursor-pointer" onClick={handleClickSignUp}>Sign-Up</a> Here.</p>
            </div>
        </>
    )
}