'use client'
import Image from "next/image";

export default function ImageProduct(imageProduct: ImageProduct){

    return (          
        <div className="flex lg:w-1/2 lg:h-screen bg-gradient-to-b from-gray-400 to-gray-900">
            {imageProduct.isVisible ? (
            <div className="bg-inherit mx-auto lg:my-44 flex justify-center">
                <div className="lg:w-[350px] w-[400px] lg:h-[350px] h-[400px] overflow-hidden rounded-md">
                    <Image
                        src={imageProduct.image_url}
                        alt={imageProduct.image_alt}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
            ) : (
            <div className="bg-inherit mx-auto lg:my-44 flex justify-center"></div>
            )}
        </div>      
    )
}