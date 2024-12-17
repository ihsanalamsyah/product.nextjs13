'use client'

import { useEffect, useState } from 'react';
import AlertFailed from '@/app/components/alertFailed';
import AlertSuccess from '@/app/components/alertSuccess';

export default function DetailProductVideo(detailProductVideo: DetailProduct){
    const [price, setPrice] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    useEffect(() => {
        const price: number = detailProductVideo.price;
        let stringPrice:string = price.toString().replace(/\./g, '');
        stringPrice = "Rp. " + stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
        setPrice(stringPrice);
    }, [detailProductVideo.price]);

    const handleCloseAlert = () => setIsAlertVisible(false);
    
    return(
        <div className="flex flex-col justify-center lg:w-1/2 lg:p-16 p-6 bg-gradient-to-b from-gray-400 to-gray-900 ">
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            ): (
                <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )}
            <p className="lg:text-5xl text-2xl font-medium text-slate-100"><b>{detailProductVideo.title.toUpperCase()}</b></p>   
            <br></br>
            <hr className="border-y-1 border-gray-700 border-slate-100"></hr>
            <br></br>
            <div className="block">
                {detailProductVideo.description != null ? (
                <p className="text-justify text-base text-slate-100">
                    {detailProductVideo.description}
                </p>          
                ):(
                <p className="text-justify text-base text-slate-100">
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum mollis cursus sed turpis risus,
                    gravida ornare nisl vulputate! Neque maecenas at enim praesent himenaeos lectus tellus. 
                    Nam non nibh duis mattis lorem. Vel dis sagittis id felis elementum nostra sapien rhoncus 
                    habitant. Curabitur tincidunt facilisis ullamcorper, felis ridiculus scelerisque. 
                    Metus orci ultrices dignissim, feugiat dis amet suspendisse.    
                </p>          
                )}
            </div>
            <br></br>
            <hr className="border-y-1 border-gray-700 border-dashed border-slate-100"></hr>
               
            <br></br>
        </div>  
    )
}