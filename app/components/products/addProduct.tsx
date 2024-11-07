'use client'

import { useState, SyntheticEvent } from "react";
import { useRouter} from "next/navigation";
import { getCookie } from '@/utils/cookies';
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

export default function AddProduct( addProduct: AddProduct){
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
        resetForm();
    }
    function resetForm(){
        setTitle("");
        setPrice(0);
        setQuantity(0);
        setCategory("");
    }

    function handleCategory(value: string){
        setCategory(value); 
    }

    async function handleSubmit(e: SyntheticEvent){
        if(category == "Video" && quantity > 1){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            return setAlertMessage("Cant submit, if video quantity cant more than 1");
        }
        e.preventDefault();
        setIsMutating(true);
        const route = process.env.NEXT_PUBLIC_ROUTE;
                
        const response = await fetch(`${route}/products`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                category: category,
                title: title,
                price: price,
                quantity: quantity
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            resetForm();
            router.refresh();
            setModal(false);
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
        else{
            setIsMutating(false);
            resetForm();
            router.refresh();
            setModal(false);
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
        
    }
    function handleQuantity(qty: number){
        if(category == "Video" && quantity > 1){
            setIsAlertVisible(true);
            setAlertStatus("Failed");
            return setAlertMessage("If video, quantity cant more than 1"); 
        }else{
            return setQuantity(qty);
        }
        
    }
    function handlePrice(price:number){
        setPrice(price);
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    if(!addProduct.isVisible){
        return null;
    }
    return (
        <div>
            <button className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mx-2" onClick={handleChange}>+ Add New</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />

            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Add New Product</h3>
                    {alertStatus == "Failed" ? (
                        <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>         
                    ): (
                        <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
                    )}  
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Category</label>
                            <select value={category} className="select select-bordered w-full border-gray-300 rounded-md select-category" onChange={(e)=> handleCategory(e.target.value)}>
                                <option disabled value={""}>Choose Category</option>
                                <option value={"Handphone"}>Handphone</option>
                                <option value={"Video"}>Video</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Product Name</label>
                            <input 
                            type="text" 
                            value={title}
                            onChange={(e)=> setTitle(e.target.value)}
                            className="input w-full input-bordered border-gray-300 rounded-md"  
                            placeholder="Product Name"/>
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Price</label>
                            <input 
                                type="text" 
                                value={price}
                                onChange={(e)=> handlePrice(Number(e.target.value))}
                                className="input w-full input-bordered border-gray-300 rounded-md" 
                                placeholder="Price" />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Quantity</label>
                            <input 
                                type="text" 
                                value={quantity}
                                onChange={(e)=>handleQuantity(Number(e.target.value))}
                                className="input w-full input-bordered border-gray-300 rounded-md" 
                                placeholder="Quantity" />
                        </div>
                        <div className="modal-action">
                            <button
                                type="button" 
                                className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300" 
                                onClick={handleChange}
                             >
                                Close
                            </button>
                            {!isMutating ? (
                            <button 
                                type="submit" 
                                className="btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                            ) : (
                            <button 
                                type="button" 
                                className="btn bg-blue-600 text-white px-4 py-2 rounded-md loading"
                            >
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