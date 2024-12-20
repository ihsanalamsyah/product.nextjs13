'use client'

import { useState, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function SignIn(signIn: ContentToogleSignIn){
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
            setCookie("token", content.data.token, 7);
            setCookie("email", content.data.user.email, 7);
            setCookie("category", "Video", 7);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            if(content.data.user.role == "Admin"){
                return router.push("/admin");
            }else{
                return router.push("/products?category=handphone");
            }       
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

    const handleClickSignUp = ()=> signIn.onToogle();
    
    const handleCloseAlert = () => setIsAlertVisible(false);

    const handleForgotPassword = () => signIn.onToogleResetPassword();

    return (
        <>
            <h1 className="lg:text-4xl text-xl text-white">Sign in</h1>
            <h1 className="text-white my-1 lg:text-base text-xs">Please enter your email and password :</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control my-2">                      
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg"  
                        placeholder="Enter your email"/>
                </div>                      
                <div className="form-control my-2">
                    {isShowPassword ? (
                    <input
                        type="text" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="Enter your password" />          
                    ) : (
                    <input
                        type="password" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="input lg:input-md input-sm w-full max-w-lg" 
                        placeholder="Enter your password" />
                    )}
                </div>
                <div className="flex justify-between my-4">
                    <div>
                        {!isMutating ? (
                        <button 
                            type="submit" 
                            className="btn btn-success lg:btn-sm btn-xs lg:px-6 lg:pb-6 lg:pt-2 text-white"
                        >
                            Continue
                        </button>
                        ) : (
                        <button 
                            type="button" 
                            className="btn loading lg:btn-sm btn-xs lg:px-6 lg:pb-6 lg:pt-2 text-white"
                        >
                        </button>
                        )}       
                    </div>
                    <div className="flex justify-end items-center">
                        <div className="lg:block hidden">
                            <p className="text-white lg:text-base text-xs"><a className="hover:underline text-blue-300 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</a></p>
                        </div>
                        <div>
                            <label className="label cursor-pointer lg:px-1 lg:py-1 px-1 py-0">                
                                <input type="checkbox" className="checkbox mx-1 lg:checkbox-sm checkbox-xs show-password-signin border-white [--chkbg:white] [--chkfg:green]" onChange={handleShowPassword}/>
                                <p className="mx-1 text-white lg:text-base text-xs">Show Password</p>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="lg:hidden">
                    <p className="text-white lg:text-base text-xs"><a className="hover:underline text-blue-300 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</a></p>
                </div>
            </form>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
            <div className="my-1">
                <p className="text-white lg:text-base text-xs">Don&#39;t have an Account? <a className="hover:underline text-blue-300 cursor-pointer" onClick={handleClickSignUp}>Sign up</a></p>
            </div>
        </>
    )
}