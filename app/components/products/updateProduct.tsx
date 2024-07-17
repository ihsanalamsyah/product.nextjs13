'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter} from "next/navigation";
import { getCookie } from '@/utils/cookies';

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function UpdateProduct(product: Products){
    const [title, setTitle] = useState(product.title!);
    const [price, setPrice] = useState(product.price!);
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
    }
    
    async function handleUpdate(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/products`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                id: product.id,
                title: title,
                price: price
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            router.refresh();
            setModal(false);
        }
        else{
            setIsMutating(false);
            router.refresh();
            setModal(false);
            alert(content.msg);
        }
   
    }
    return (
        <div>
            <button className="btn btn-info btn-sm" onClick={handleChange}> 
                Edit
            </button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />


            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit {product.title}</h3>
                    <form onSubmit={handleUpdate}>
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
                            onChange={(e)=> setPrice(Number(e.target.value))}
                            className="input w-full input-bordered" 
                            placeholder="Price" />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            {!isMutating ? (
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Updating...
                            </button>
                            )}
                           
                          
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}