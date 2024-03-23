'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from '../utils/cookies';




export default function Login(){
    
    const route = "http://localhost:4000/api";
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);

    function resetForm(){
        setName("");
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                password: password
            })
        });
        const content = await response.json();
        if(content.status == "OK"){            
            setIsMutating(false);
            setModal(false);
            setCookie("token", content.token, 7);
            setCookie("name", content.data.name, 7);
            setCookie("role", content.data.role, 7);
            resetForm();
            // return router.push({
            //     pathname: '/products',
            //     query: { token: content.token,  name: content.data.name, role: content.data.role} // Melewatkan variabel via query string
            //   });
            return router.push(`products/`);            
        }
        else{            
            setIsMutating(false);
            setModal(false);
            alert(content.msg);
            resetForm();
            // return router.push({
            //     pathname: '/'
            //   });
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
                            <label className="label font-bold">Name</label>
                            <input 
                            type="text" 
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            className="input w-full input-bordered"  
                            placeholder="Name"/>
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
                                Save
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Saving...
                            </button>
                            )}
                           
                          
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}