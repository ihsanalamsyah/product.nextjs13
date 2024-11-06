'use client'
import Image from "next/image";

export default function ImageProduct(imageProduct: ImageProduct){

    return (          
        <div className="w-1/2 h-screen bg-gradient-to-b from-gray-400 to-gray-900 flex">
            {imageProduct.isVisible ? (
            <figure className="bg-gray-200 w-3/4 mx-auto my-44 flex">
                <Image
                    src={imageProduct.image_url}
                    alt={imageProduct.image_alt}
                    width={300}
                    height={200}
                    className="m-auto"></Image>
            </figure>
            ) : (
            <div className="w-3/4 mx-auto h-screen"></div>
            )}
        </div>      
    )
}