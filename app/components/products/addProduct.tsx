'use client'

import { useState, SyntheticEvent } from "react";
import { getCookie } from '@/utils/cookies';
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

export default function AddProduct( addProduct: AddProduct){
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("0");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [modal, setModal] = useState(false);
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
        setPrice("0");
        setQuantity(0);
        setCategory("");
        setDescription("");
    }

    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        if(category == "Video" && quantity > 1){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Cant submit, if video quantity cant more than 1");
            return;
        }
        if(Number.isNaN(price)){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Price is not a number");
            return;
        }
        if(category == ""){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Category is required");
            return;
        }
        if(title == ""){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Title is required");
            return;
        }
        if(Number(price) <= 0){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Price is required");
            return;
        }    
        if(quantity <= 0){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Quantity is required");
            return;
        }
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
                quantity: quantity,
                description: description
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            resetForm();
            addProduct.onUpdateTable();
            setModal(false);
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
            return;
        }
        else{
            setIsMutating(false);
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
            return;
        }
        
    }
    function handleQuantity(qty: number){
        if(category == "Video" && quantity > 1){
            setIsAlertVisible(true);
            setAlertStatus("Failed");
            setAlertMessage("If video, quantity cant more than 1");
            return;
        }else{
            setQuantity(qty);
            return;
        }
    }

    function handlePrice(price:string){
        let stringPrice:string = price.toString().replace(/\./g, '');
        stringPrice = stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setPrice(stringPrice);
    }
    const handleCloseAlert = () => setIsAlertVisible(false);

    const handleCategory = (value: string) => setCategory(value); 

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
                                className="input input-bordered w-full border-gray-300 rounded-md"  
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Description</label>
                            <textarea 
                                value={description}
                                onChange={(e)=> setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full border-gray-300 rounded-md" 
                                placeholder="Description"
                            >
                            </textarea>
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Price</label>
                            <input 
                                type="text" 
                                value={price}
                                onChange={(e)=> handlePrice(e.target.value)}
                                className="input w-full input-bordered border-gray-300 rounded-md" 
                                placeholder="Price" 
                            />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Quantity</label>
                            <input 
                                type="text" 
                                value={quantity}
                                onChange={(e)=>handleQuantity(Number(e.target.value))}
                                className="input w-full input-bordered border-gray-300 rounded-md" 
                                placeholder="Quantity" 
                            />
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
                            </button>
                            )}                  
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}