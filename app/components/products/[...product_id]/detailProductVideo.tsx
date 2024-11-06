'use client'


import { useEffect, useState } from 'react';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';
import BackToDashboard from '@/app/components/products/[...product_id]/backToDashboard';

export default function DetailProductVideo(detailProductVideo: DetailProductHandphone){
    const [price, setPrice] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    useEffect(() => {
        const price: number = detailProductVideo.price;
        let stringPrice:string = price.toString().replace(/\./g, '');
        stringPrice = stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setPrice(stringPrice);
    }, [detailProductVideo.price]);

    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    {alertStatus == "Failed" ? (
        <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
    ): (
        <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
    )}
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
            <div className="collapse collapse-arrow border-base-300 bg-base-200 border lg:hidden grid">
                <input type="checkbox" />
                <div className="collapse-title"><p className="text-md lg:text-xl">View Product Description</p></div>
                <div className="collapse-content">
                    <p className="text-justify lg:text-base text-sm">
                        Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                        gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                        Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                        habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                        Metus orci ultrices dignissim, feugiat dis amet suspendisse.
                    </p>
                </div>
            </div>
            <div className="lg:block hidden">
                <p className="text-justify lg:text-base text-sm">
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                    gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                    Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                    habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                    Metus orci ultrices dignissim, feugiat dis amet suspendisse.
                </p>
            </div>
            <br></br>
            <hr className="border-y-1 border-gray-700 border-dashed"></hr>
               
            <br></br>
            <div className='flex'>
                <BackToDashboard category={"video"}/>
            </div>

        </div> 
        
    )
}