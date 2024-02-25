'use client'

import { useState, SyntheticEvent, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";



export default function AddProduct(){
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    const searchParams = useSearchParams()
    const token = searchParams.get('token');
    function handleChange(){
        setModal(!modal);
    }
   
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const route = "http://localhost:4000";
                
        const response = await fetch(`${route}/products`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                title: title,
                price: price
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setTitle("");
            setPrice("");
            router.refresh();
            setModal(false);
        }
        else{
            setIsMutating(false);
            setTitle("");
            setPrice("");
            router.refresh();
            setModal(false);
            alert(content.msg);
        }
        
    }
    return (
        <div>
            <button className="btn mx-2" onClick={handleChange}>Add New</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />

            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Product</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label font-bold">Title</label>
                            <input 
                            type="text" 
                            value={title}
                            onChange={(e)=> setTitle(e.target.value)}
                            className="input w-full input-bordered"  
                            placeholder="Product Name"/>
                        </div>
                        <div className="form-control">
                            <label className="label font-bold">Price</label>
                            <input 
                            type="text" 
                            value={price}
                            onChange={(e)=> setPrice(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Price" />
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