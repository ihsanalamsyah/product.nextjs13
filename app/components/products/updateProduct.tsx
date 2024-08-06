'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter} from "next/navigation";
import { getCookie } from '@/utils/cookies';
import { ChangeEvent } from "react";
import { supabase } from '@/utils/supabase';
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function UpdateProduct(product: Products){
    const [title, setTitle] = useState(product.title!);
    const [price, setPrice] = useState(product.price!);
    const [quantity, setQuantity] = useState(product.quantity!);
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
        setTitle(product.title!)
        setPrice(product.price!)
        setQuantity(product.quantity!)
    }
    
    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {

        try{
            const fileInput = e.target;
            const files = fileInput.files;
            if (files && files.length > 0) {
                const file = files[0];
               
                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(`Foto-product_id-${product.id}.png`, file!);

                if (error != null) {
                    if(error.message == "The resource already exists"){
                        const { data, error } = await supabase
                            .storage
                            .from('images')
                            .update(`Foto-product_id-${product.id}.png`, file!, {
                            cacheControl: '3600',
                            upsert: true
                        })
                        if(error != null){
                            setAlertMessage(error.message);
                            setAlertStatus("Failed");
                            setIsAlertVisible(true);
                            return console.error(error.message);
                        }else{
                            setAlertMessage(`Success update image to product id ${product.id}`);
                            setAlertStatus("OK");
                            setIsAlertVisible(true);
                        }
                    }else{
                        setAlertMessage(error.message);
                        setAlertStatus("Failed");
                        setIsAlertVisible(true);
                        return console.error(error.message);
                    }               
                }else{
                    setAlertMessage(`Success upload image to product id ${product.id}`);
                    setAlertStatus("OK");
                    setIsAlertVisible(true);
                }            
            }
        } catch (error){
            setAlertMessage(error as string);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            console.error(error);
        }
            
    };
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
                price: price,
                quantity: quantity
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
            setAlertMessage(content.msg);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
        }
   
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    return (
        <div>
            <button className="btn btn-info btn-sm mx-1" onClick={handleChange}> 
                Edit
            </button>


            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit {product.title}</h3>
                    <h1 className="font-bold text-md">Category : {product.category}</h1>
                    {alertStatus == "Failed" ? (
                        <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>         
                    ): (
                        <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
                    )}  
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
                        <div className="form-control">
                            <label className="label font-bold">Quantity</label>
                            {product.category == "Video" ? (
                               <>
                                <input 
                                    type="text"
                                    value={quantity}
                                    onChange={(e)=> setQuantity(Number(e.target.value))}
                                    className="input w-full input-bordered" 
                                    placeholder="Quantity" 
                                    disabled={true}/>
                               </>
                            ) : (
                                <>                         
                                <input 
                                    type="text"
                                    value={quantity}
                                    onChange={(e)=> setQuantity(Number(e.target.value))}
                                    className="input w-full input-bordered" 
                                    placeholder="Quantity" 
                                    disabled={false}/>
                                </>
                            )}                                       
                        </div>
                        <div>
                            <label className="label font-bold">Upload Image</label>
                            <form method="post" encType="multipart/form-data">        
                                <input className="" id="file_input" onChange={handleFileChange} type="file" name="image" accept="image/*"/>          
                            </form>
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