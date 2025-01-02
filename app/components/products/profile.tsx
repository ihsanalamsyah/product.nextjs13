'use client'

import { useState, SyntheticEvent, useEffect } from "react";
import { getCookie } from '@/utils/cookies';
import { ChangeEvent, useMemo } from "react";
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function Profile(profile: Profile){
    const [id, setId] = useState<number>(profile.user_id ?? 0);
    const [name, setName] = useState<string>(profile.name ?? "");
    const [phone, setPhone] = useState<number>(profile.phone ?? 0);
    const token = getCookie("token");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const profileName = useMemo(() => profile.name, [profile.name]);
    const [modal, setModal] = useState(false);
    
    const handleCloseAlert = () => setIsAlertVisible(false);

    function handleChange(){
        profile.handleChangeProfile();
    }
    async function handleFileChange (e:ChangeEvent<HTMLInputElement>):Promise<void> {
        try{
            setModal(false);
            profile.onProcessing(true);
            const fileInput = e.target;
            const files = fileInput.files;
            if (files && files.length > 0) {
                const file = files[0];
                const user_id = id!.toString();
                const formData = new FormData();
                formData.append('file', file);
                formData.append('user_id', user_id);
                const response = await fetch(`${route}/uploadProfilePicture`,{
                    method: 'POST',
                    headers: {
                       'Authorization': 'Bearer '+ token,
                    },
                    body: formData
                });
                const content = await response.json();
                if(content.status == "OK"){
                    profile.onProcessing(false);
                    setModal(true);
                    setAlertMessage(content.msg);
                    setAlertStatus(content.status);
                    setIsAlertVisible(true);
                }
                else{
                    profile.onProcessing(false);
                    setModal(true);
                    setAlertMessage(content.msg);
                    setAlertStatus(content.status);
                    setIsAlertVisible(true);
                }           
            }
        } catch (error){
            profile.onProcessing(false);
            setModal(true);
            setAlertMessage(error as string);
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            console.error(error);
        }
            
    };
    async function handleUpdate(e: SyntheticEvent):Promise<void>{
        e.preventDefault();
        setIsMutating(true);
        setModal(false);
        profile.onProcessing(true);
        const response = await fetch(`${route}/users`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                id: id,
                name: name,
                phone: phone == 0 ? null : phone,
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            profile.onProcessing(false);
            setModal(true);
            setIsMutating(false);
            profile.onUpdateTable();
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
        else{
            profile.onProcessing(false);
            setModal(true);
            setIsMutating(false);
            setAlertMessage(content.msg);
            setAlertStatus(content.status);
            setIsAlertVisible(true);
        }
    }
    useEffect(()=>{      
        if(profile.modalProfile){
            setModal(true);
        }else{
            setModal(false);
        }
    }, [profile.modalProfile]);
    return (
        <>
            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Update profile {profileName}</h3>
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
                                    placeholder="Username"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={(e)=> setPhone(Number(e.target.value))}
                                    className="input w-full input-bordered border-gray-300 rounded-md" 
                                    placeholder="Phone Number"
                                />
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