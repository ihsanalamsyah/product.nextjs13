'use client'

import { useState } from 'react';
import { getCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

export default function DetailProductPhone(detailProductPhone: DetailProduct){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const detailPrice: number = detailProductPhone.price;
    let stringPrice:string = detailPrice.toString().replace(/\./g, '');
    stringPrice = "Rp. " + stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
    const [price, setPrice] = useState(stringPrice);
    const [quantityBuy, setQuantityBuy] = useState(1);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertDuration, setAlertDuration] = useState(3000);
    const [quantity, setQuantity] = useState(detailProductPhone.quantity);
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const token = getCookie("token");
    const email = getCookie("email");

    const resetForm = () => setQuantityBuy(1);
    
    function handlePlus(){
        if(quantity <= 0){
            setAlertMessage("Product is empty");
            setIsAlertVisible(true);
            setAlertStatus("Failed");
        }
        if(quantityBuy < quantity){
            setQuantityBuy(quantityBuy + 1)
        }else{
            setAlertMessage("Buy quantity lebih dari quantity product");
            setIsAlertVisible(true);
            setAlertStatus("Failed");
        }
    }

    function handleMinus(){
        if(quantityBuy > 0){
            setQuantityBuy(quantityBuy - 1)
        }
    }
    

    async function handleBuy(){
        setIsMutating(true);
    
        const response = await fetch(`${route}/storeToCart`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                email: email,
                product_id: detailProductPhone.id,
                quantity: quantityBuy
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            setModal(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertDuration(10000);
            setAlertStatus(content.status);
            resetForm();
        }
        else{
            setIsMutating(false);
            setModal(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertDuration(10000);
            setAlertStatus(content.status);
            resetForm();
        }
    }

    const handleCloseAlert = () => setIsAlertVisible(false);

    return(
        <div className="flex flex-col justify-center lg:w-1/2 lg:p-16 p-6">         
            <p className="lg:text-2xl lg:block hidden font-medium tracking-wider underline underline-offset-1">Product Detail :</p>
            <p className="lg:text-5xl text-2xl font-medium"><b>{detailProductPhone.title.toUpperCase()}</b></p>
            <div className="flex justify-between">
                <p className="lg:text-2xl text-lg font-medium">Price : {price}</p>
            </div>  
             
            <hr className="border-y-1 border-gray-700"></hr>
            <br></br>
            <div className="collapse collapse-arrow border-base-300 bg-base-200 border lg:hidden grid">
                <input type="checkbox" />
                <div className="collapse-title"><p className="text-base lg:text-xl">View Product Description</p></div>
                <div className="collapse-content">
                    {detailProductPhone.description != null ? (
                    <p className="text-justify text-base">
                        {detailProductPhone.description}
                    </p>          
                    ):(
                    <p className="text-justify text-base">
                        Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                        gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                        Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                        habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                        Metus orci ultrices dignissim, feugiat dis amet suspendisse.    
                    </p>          
                    )}
                </div>
            </div>
            <div className="lg:block hidden">
                {detailProductPhone.description != null ? (
                <p className="text-justify text-base">
                    {detailProductPhone.description}
                </p>          
                ):(
                <p className="text-justify text-base">
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                    gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                    Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                    habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                    Metus orci ultrices dignissim, feugiat dis amet suspendisse.    
                </p>          
                )}
            </div>
            <br></br>
            <hr className="border-y-1 border-gray-700 border-dashed"></hr>
            <p className="lg:text-2xl text-lg font-medium">Quantity : {quantity}</p>
            <br></br>
            <div className="join">
                <button className="btn join-item btn-md lg:w-24" onClick={handleMinus} disabled={quantityBuy === 1}><p className='text-2xl'>-</p></button>
                <button className="btn join-item no-animation !hover:none focus:none active:none btn-md lg:w-[27rem] w-64 "><p className='text-2xl'>{quantityBuy}</p></button>
                <button className="btn join-item btn-md lg:w-24" onClick={handlePlus} disabled={quantityBuy === detailProductPhone.quantity}><p className='text-2xl'>+</p></button>
            </div>
            <br></br>
            {quantity > 0 ? (
                <button className="btn btn-success btn-sm" disabled={false} onClick={handleBuy}>+ Cart</button>
            ) :(
                <button className="btn btn-success btn-sm" disabled={true}>+ Cart</button>
            )}
            
            <br></br>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert} duration={alertDuration}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert} duration={alertDuration}/>
            )}
            <br></br>
           
        </div>    
    )
}