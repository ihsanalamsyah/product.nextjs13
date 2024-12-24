'use client'

import { useState, SyntheticEvent } from "react";
import { getCookie } from '@/utils/cookies';
import { ChangeEvent } from "react";
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";
const route = process.env.NEXT_PUBLIC_ROUTE;

export default function UpdateProduct(product: EditProduct){
    const [title, setTitle] = useState(product.title!);
    const [description, setDescription] = useState(product.description! ?? "");
    const priceProduct: number = product.price!;
    let stringPrice:string = priceProduct.toString().replace(/\./g, '');
    stringPrice = stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const [price, setPrice] = useState(stringPrice);
    const [quantity, setQuantity] = useState(product.quantity!);
    const [modal, setModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [alertDuration, setAlertDuration] = useState(3000);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
        setTitle(product.title!);
        setPrice(stringPrice);
        setQuantity(product.quantity!);
        setDescription(product.description! ?? "");
    }
    
    async function handleFileChange(e:ChangeEvent<HTMLInputElement>) {
        try{
            const fileInput = e.target;
            const files = fileInput.files;
            if (files && files.length > 0) {
                const file = files[0];
                const product_id = product.id!.toString();
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', product.category!);
                formData.append('product_id', product_id);
                const response = await fetch(`${route}/uploadContent`,{
                    method: 'POST',
                    headers: {
                       'Authorization': 'Bearer '+ token,
                    },
                    body: formData
                });
                const content = await response.json();
                if(content.status == "OK"){
                    const response = await fetch(`${route}/uploadThumbnail`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+ token
                        },
                        body: JSON.stringify({
                            product_id: product_id
                        })
                    });
                    const content = await response.json();
                    if(content.status == "OK"){
                        setAlertDuration(10000);
                        setAlertMessage(content.msg);
                        setAlertStatus(content.status);
                        setIsAlertVisible(true);
                    }else{
                        setAlertDuration(10000);
                        setAlertMessage(content.msg);
                        setAlertStatus(content.status);
                        setIsAlertVisible(true);
                    }
                }
                else{
                    setAlertDuration(10000);
                    setAlertMessage(content.msg);
                    setAlertStatus(content.status);
                    setIsAlertVisible(true);
                }
            }
        } catch (error){
            setAlertDuration(10000);
            setAlertMessage(error as string);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
        }       
    }
    async function handleUpdate(e: SyntheticEvent){
        e.preventDefault();
        if(Number.isNaN(price)){
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            setAlertMessage("Price is not a number");
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
                quantity: quantity,
                description: description
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            product.onUpdateTable();
            setModal(false);
        }
        else{
            setIsMutating(false);
            setAlertMessage(content.msg);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
        }
   
    }
    const handleCloseAlert = () => setIsAlertVisible(false);

    function handlePrice(price:string){
        let stringPrice:string = price.toString().replace(/\./g, '');
        stringPrice = stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setPrice(stringPrice);
    }
    return (
        <div>
            <button className="btn btn-info btn-sm mx-1 w-max" onClick={handleChange}>Update</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Update {product.title}</h3>
                    <h1 className="text-md font-semibold text-gray-600 mb-6">Category: {product.category}</h1>
                    {alertStatus === "Failed" ? (
                        <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert} duration={alertDuration} />
                    ) : (
                        <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert} duration={alertDuration} />
                    )}
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input w-full input-bordered border-gray-300 rounded-md"  
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
                                onChange={(e) => handlePrice(e.target.value)}
                                className="input w-full input-bordered border-gray-300 rounded-md" 
                                placeholder="Price"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700 mb-1">Quantity</label>
                            <input 
                                type="text"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="input w-full input-bordered border-gray-300 rounded-md"
                                placeholder="Quantity" 
                                disabled={product.category === "Video"}
                            />
                        </div>

                        {product.category === "Video" ? (
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Upload Video Product</label>              
                                <input 
                                    className="file-input file-input-bordered w-full border-gray-300 rounded-md"
                                    id="file_input" 
                                    onChange={handleFileChange} 
                                    type="file" 
                                    name="video" 
                                    accept="video/*"
                                />         
                            </div>
                        ) : product.category === "Handphone" ? (
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Upload Image Product</label>          
                                <input 
                                    className="file-input file-input-bordered w-full border-gray-300 rounded-md"
                                    id="file_input" 
                                    onChange={handleFileChange} 
                                    type="file" 
                                    name="image" 
                                    accept="image/*"
                                />     
                            </div>
                        ) : <></>}

                        <div className="modal-action mt-6 flex justify-end space-x-2">
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
                                    Update
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