'use client'


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookies';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

export default function DetailProduct(detailProduct: DetailProduct){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [price, setPrice] = useState("");
    const [quantityBuy, setQuantityBuy] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [quantity, setQuantity] = useState(detailProduct.quantity);
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const token = getCookie("token");
    const email = getCookie("email");

    useEffect(() => {
        const price: number = detailProduct.price;
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
                product_id: detailProduct.id,
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
           
            <p className="text-2xl font-medium tracking-wider underline underline-offset-1">Product Detail :</p>
            <p className="text-5xl font-medium"><b>{detailProduct.title.toUpperCase()}</b></p>
            <div className="flex justify-between">
                <p className="text-2xl font-medium">Price : Rp. {price},00</p>
                <p className="text-2xl font-medium">Quantity : {quantity}</p>
            </div>  
             
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
            <p className="text-2xl font-medium">Quantity :</p>
            <br></br>
            <div className="join">
                <button className="btn join-item btn-md w-24" onClick={handleMinus}><p className='text-2xl'>-</p></button>
                <button className="btn join-item no-animation btn-md w-96"><p className='text-2xl'>{quantityBuy}</p></button>
                <button className="btn join-item btn-md w-24" onClick={handlePlus}><p className='text-2xl'>+</p></button>
            </div>
            <br></br>
            {quantity > 0 ? (
                <button className="btn btn-success btn-sm" disabled={false} onClick={handleModalBuy}>Buy</button>
            ) :(
                <button className="btn btn-success btn-sm" disabled={true} >Buy</button>
            )}
            
            <br></br>
            <div className='flex'>
                <Link href="/products"><button className="btn btn-outline btn-sm">&lt; Back To Dashboard</button></Link>
            </div>


            <input type="checkbox" checked={modal} onChange={handleModalBuy} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure want to buy {detailProduct.title} with quantity: {quantityBuy} ?</h3>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleModalBuy}>
                            Close
                        </button>
                        {!isMutating ? (
                        <button type="button" onClick={handleBuy} className="btn btn-primary">
                            Buy
                        </button>
                        ) : (
                        <button type="button" className="btn loading">
                            Buying...
                        </button>
                        )}                 
                    </div>
                </div>
            </div>
        </div> 

        
    )
}