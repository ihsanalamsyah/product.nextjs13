'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '@/utils/cookies';



export default function Login(){
    
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);

    function resetForm(){
        setEmail("");
        setPassword("");
    }
    function handleChange(){
        setModal(!modal);
    }
   
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
            },
            mode: 'no-cors',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setModal(false);
            setCookie("token", content.token, 7);
            setCookie("email", content.data.email, 7);
            setCookie("role", content.data.role, 7);
            resetForm();
          
            return router.push(`/products`);
        }
        else{            
            setIsMutating(false);
            setModal(false);
            alert(content.msg);
            resetForm();
            return router.push("/");
        }
        
    }
    return (
        <div>
            <button className="btn mx-2" onClick={handleChange}>Login</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />


            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Login User</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label font-bold">Email</label>
                            <input 
                            type="text" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="input w-full input-bordered"  
                            placeholder="Email"/>
                        </div>                      
                        <div className="form-control">
                            <label className="label font-bold">Password</label>
                            <input 
                            type="text" 
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Password" />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            {!isMutating ? (
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Login...
                            </button>
                            )}
                           
                          
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}