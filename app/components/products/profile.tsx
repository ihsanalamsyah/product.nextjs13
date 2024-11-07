'use client'

import { useState, SyntheticEvent, useEffect } from "react";
import { useRouter} from "next/navigation";
import { getCookie } from '@/utils/cookies';
import { ChangeEvent } from "react";
import { supabase } from '@/utils/supabase';
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function Profile(profile: Profile){
    const router = useRouter();
    const [id, setId] = useState(profile.user_id);
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const token = getCookie("token");
    const email = getCookie("email");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [modalProfile, setModalProfile] = useState(profile.modalProfile);

    function handleCloseAlert(){
        setIsAlertVisible(false);
    }
    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {

        try{
            const fileInput = e.target;
            const files = fileInput.files;
            if (files && files.length > 0) {
                const file = files[0];
                let respUploadStorage: any = await supabase.storage
                    .from('images')
                    .upload(`Foto-user-user_id-${id}.png`, file!);
               
                if (respUploadStorage.error != null) {
                    if(respUploadStorage.error.message == "The resource already exists"){
                        let respUpdateStorage: any = await supabase
                            .storage
                            .from('images')
                            .update(`Foto-user-user_id-${id}.png`, file!, {
                            cacheControl: '3600',
                            upsert: true
                        });
                                            
                        if(respUpdateStorage.error != null){
                            setAlertMessage(respUpdateStorage.error.message);
                            setAlertStatus("Failed");
                            setIsAlertVisible(true);
                            return console.error(respUpdateStorage.error.message);
                        }else{
                            setAlertMessage(`Success upload image user ${name}`);
                            setAlertStatus("OK");
                            setIsAlertVisible(true);
                        }
                    }else{
                        setAlertMessage(respUploadStorage.error.message);
                        setAlertStatus("Failed");
                        setIsAlertVisible(true);
                    }               
                }else{
                    setAlertMessage(`Success upload image user ${name}`);
                    setAlertStatus("OK");
                    setIsAlertVisible(true);
                }            
            }
        } catch (error){
            setAlertMessage(error as string);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            console.error(error);
        }
            
    };
    async function handleUpdate(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/users`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                id: id,
                name: name,
                phone: phone,
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            router.refresh();
            profile.handleChangeProfile();
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
        else{
            setIsMutating(false);
            router.refresh();
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
    }
    
    
    return (
        <>
            <input type="checkbox" checked={profile.modalProfile} onChange={profile.handleChangeProfile} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Update profile {name}</h3>
                    {alertStatus == "Failed" ? (
                        <AlertFailed message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>         
                    ): (
                        <AlertSuccess message={alertMessage} visible={isAlertVisible} onClose={handleCloseAlert}/>
                    )}  
                    <div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e)=> setName(e.target.value)}
                                    className="input w-full input-bordered border-gray-300 rounded-md"  
                                    placeholder="Username"/>
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={(e)=> setPhone(Number(e.target.value))}
                                    className="input w-full input-bordered border-gray-300 rounded-md" 
                                    placeholder="Phone Number" />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Upload Image User</label>      
                                <input 
                                    className="file-input file-input-bordered w-full border-gray-300 rounded-md" 
                                    id="file_input" 
                                    onChange={handleFileChange}
                                    type="file" 
                                    name="image" 
                                    accept="image/*"
                                 />          
                            </div>   
                            <div className="modal-action mt-6 flex justify-end space-x-2">
                                <button
                                    type="button" 
                                    className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300" 
                                    onClick={profile.handleChangeProfile}
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
                                    Updating...
                                </button>
                                )}                                        
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}