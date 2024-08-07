'use client'


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';
import BackToDashboard from '@/app/components/products/[...product_id]/backToDashboard';

export default function DetailProductVideo(detailProductVideo: DetailProductPhone){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [price, setPrice] = useState("");
    const [quantityBuy, setQuantityBuy] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [quantity, setQuantity] = useState(detailProductVideo.quantity);
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const token = getCookie("token");
    const email = getCookie("email");

    useEffect(() => {
        const price: number = detailProductVideo.price;
        let stringPrice:string = price.toString().replace(/\./g, '');
        stringPrice = stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setPrice(stringPrice);
    }, []);

    function resetForm(){
        setQuantityBuy(0);
    }
    function handlePlus(){
        if(quantity <= 0){
            setAlertMessage("Product sudah habis");
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
    
    function handleModalBuy(){
        if(quantityBuy <= 0){
            setAlertMessage("Please add quantity first");
            setIsAlertVisible(true);
            setAlertStatus("Failed");
        }else{
            setModal(!modal);
        }    
    }

    async function handleBuy(){
        setIsMutating(true);
    
        const response = await fetch(`${route}/buyProduct`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                email: email,
                product_id: detailProductVideo.id,
                quantity: quantityBuy
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setQuantity(content.data[0].quantity);
            setIsMutating(false);
            setModal(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
        }
        else{
            setIsMutating(false);
            setModal(false);
            setAlertMessage(content.msg);
            setIsAlertVisible(true);
            setAlertStatus(content.status);
            resetForm();
        }
    }
    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    return(
        <div className='flex flex-col justify-center w-1/2 m-16'>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
           
            <p className="text-5xl font-medium"><b>{detailProductVideo.title.toUpperCase()}</b></p>
           
            <br></br>
             
            <hr className="border-y-1 border-gray-700"></hr>
            <br></br>
            <p className='text-justify'>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                Metus orci ultrices dignissim, feugiat dis amet suspendisse.
            </p>
            <br></br>
            <hr className="border-y-1 border-gray-700 border-dashed"></hr>
               
            <br></br>
            <div className='flex'>
                <BackToDashboard />
            </div>

        </div> 
        
    )
}