'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import env from "dotenv";
import $ from 'jquery'
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

env.config();
const route = process.env.NEXT_PUBLIC_ROUTE;


export default function SignUp(signUp:ContentToogle){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);


    function resetForm(){
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setGender("");
        setRole("");
        $(".select-role").val("");
        $(".select-gender").val("");
    }
    function handleGender(value: string){
        setGender(value);   
    }
    function handleRole(value: string){
        setRole(value);    
    }
  
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        if(password != confirmPassword){
            setIsMutating(false);
            router.refresh();
            setAlertMessage("Your passowrd is different");
            setIsAlertVisible(true);
            setAlertStatus("Failed");
        }
        const response = await fetch(`${route}/signUp`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                gender: gender,
                password: password,
                role: role
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            router.refresh();
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            return router.push("/");
        }
        else{
            setIsMutating(false);
            router.refresh();
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
            return router.push("/");
        }
        
    }

    function handleShowPassword(){
        const checkbox = $(".show-password-signup")
        if(checkbox.is(':checked')){
            setIsShowPassword(true);
        }else{
            setIsShowPassword(false);
        }
    }
    function handleClickSignIn(){
        signUp.onToogle();
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    return (
        <>
            <h1 className="text-4xl text-white">Sign-Up.</h1>
            <h1 className="text-white my-1">Please Enter Your Identity Correctly :</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control my-2">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        className="input input-md w-full max-w-lg"  
                        placeholder="Name"/>
                </div>
                <div className="my-2">
                    <select defaultValue={""} className="select select-bordered w-full max-w-lg select-gender" onChange={(e)=> handleGender(e.target.value)}>
                        <option disabled value={""}>Gender</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Female"}>Female</option>
                    </select>
                </div>
                <div className="form-control my-2">
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className="input input-md w-full max-w-lg" 
                        placeholder="Email" />
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
                <div className="form-control my-2">
                    {isShowPassword ? (
                    <input 
                        type="text" 
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        className="input input-md w-full max-w-lg" 
                        placeholder="Confirm Password" />
                    ) : (
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        className="input input-md w-full max-w-lg" 
                        placeholder="Confirm Password" />
                    )}
                    
                </div>
                <div className="my-2">
                    <select defaultValue={""} className="select select-bordered w-full max-w-lg select-role" onChange={(e)=> handleRole(e.target.value)}>
                        <option disabled value={""}>Role</option>
                        <option value={"Admin"}>Admin</option>
                        <option value={"User"}>User</option>
                    </select>
                </div>
                <div className="flex justify-between my-2">
                    <div>
                        {!isMutating ? (
                        <button type="submit" className="btn btn-success btn-sm px-6 pb-6 pt-2 text-white">
                            Submit
                        </button>
                        ) : (
                        <button type="button" className="btn loading btn-sm px-6 pb-6 pt-2 text-white">
                            Submit...
                        </button>
                        )}       
                    </div>
                    <div>
                        <label className="label cursor-pointer">                
                            <input type="checkbox" className="checkbox mx-1 show-password-signup border-white [--chkbg:white] [--chkfg:green]" onChange={handleShowPassword}/>
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
                <p className="text-white">You have an Account? <a className="underline text-blue-300 cursor-pointer" onClick={handleClickSignIn}>Sign-In</a> Here.</p>
            </div>
        </>
    )
}