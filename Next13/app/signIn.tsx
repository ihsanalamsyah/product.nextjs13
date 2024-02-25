'use client'

import { useState, SyntheticEvent, use } from "react";
import { useRouter } from "next/navigation";

const route = "http://localhost:4000";

export default function SignIn(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);

    function handleChange(){
        setModal(!modal);
    }
   
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/signin`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                gender: gender,
                password: password
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setName("");
            setPassword("");
            router.refresh();
            setModal(false);
            return router.push(`products/?token=${content.token}&name=${content.data.name}`);  
        }
        else{
            setIsMutating(false);
            setName("");
            setPassword("");
            router.refresh();
            setModal(false);
            return router.push("/");
        }
        
    }
    return (
        <div>
            <button className="btn mx-2" onClick={handleChange}>Sign In</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />


            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Sign In User</h3>
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
                            <label className="label font-bold">Email</label>
                            <input 
                            type="text" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Email" />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold">Gender</label>
                            <input 
                            type="text" 
                            value={gender}
                            onChange={(e)=> setGender(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Gender" />
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