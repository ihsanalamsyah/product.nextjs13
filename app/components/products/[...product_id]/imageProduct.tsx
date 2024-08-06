'use client'
import Image from "next/image";

export default function ImageProduct(imageProduct: ImageProduct){

    return (          
        <div className='w-1/2 h-full bg-gradient-to-b from-violet-200 to-violet-900'>
            {imageProduct.isVisible ? (
            <Image src={imageProduct.image_url} 
                className='w-3/4 mx-auto my-44'
                alt={imageProduct.image_alt}
                width={100}
                height={100}/>
            ) : (
            <div className="w-3/4 mx-auto my-44"></div>
            )}
        </div>      
    )
}