'use client'

import { ChangeEvent } from "react";
import { supabase } from '@/utils/supabase';

export default function UploadImageProduct(uploadImageProduct: UploadImageProduct){

    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {

        try{
            const fileInput = e.target;
            const files = fileInput.files;
            if (files && files.length > 0) {
                const file = files[0];
               
                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(`Foto-product_id-${uploadImageProduct.product_id}.png`, file!);

                if (error != null) {
                    if(error.message == "The resource already exists"){
                        const { data, error } = await supabase
                            .storage
                            .from('images')
                            .update(`Foto-product_id-${uploadImageProduct.product_id}.png`, file!, {
                            cacheControl: '3600',
                            upsert: true
                        })
                        if(error != null){
                            return console.error(error.message);
                        }else{
                            return alert(`Success update image to product id ${uploadImageProduct.product_id}`)
                        }
                    }else{
                        return console.error(error.message);
                    }
                    
                }else{
                    return alert(`Success upload image to product id ${uploadImageProduct.product_id}`)
                }
                
            }
        } catch (error){
            console.error(error);
        }
            
    };
    return (
        <div>
            {uploadImageProduct.isAdmin ? (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                <form method="post" encType="multipart/form-data">        
                    <input className="" id="file_input" onChange={handleFileChange} type="file" name="image" accept="image/*"/>          
                </form>
            </div>
            ) : (
            <div></div>
            )}
        </div>
    )
}