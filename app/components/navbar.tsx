'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Profile from "@/app/components/profile";
import Logout from "@/app/components/logout";
import { supabase } from '@/utils/supabase';


export default function Navbar(navbar: Navbar){
    const [modalLogout, setModalLogout] = useState(false);
    const [modalProfile, setModalProfile] = useState(false);
    const [urlImageProfile, setUrlImageProfile] = useState("");
    const [users, setUsers] = useState<Users[]>(navbar.users);
    const router = useRouter();

    function handleHomePage(){
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }else{
            return router.push("/products?category=Phone");
        }
        
    }
    function handleCategoryPhone(){
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }else{
            return router.push("/products?category=Phone");
        }
        
    }
    function handleCategoryVideo(){
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }else{
            return router.push("/products?category=Video");
        }
        
    } 
    function handleChangeProfile(){
        setModalProfile(!modalProfile);
    }
    function handleChangeLogout(){
        setModalLogout(!modalLogout);
    }
    async function getImageUrl(user_id:number){
        let imageUrl:string = "";
        const { data } = supabase.storage
            .from('images')
            .getPublicUrl(`Foto-user-user_id-${user_id}.png`)
    
        if(data.publicUrl != ""){
            imageUrl = data.publicUrl;
        }
        return imageUrl;
    }
    useEffect(()=>{
        
        const fetchData =  async ()=>{
            const imageUrl:string = await getImageUrl(users[0]?.id!);
            setUrlImageProfile(imageUrl);
        }
        fetchData();
    }, []);
    return (
        <>
        <div className="navbar bg-black fixed top-0 left-0 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li className="text-white"><a><b>Home</b></a></li>
                        <li className="text-white">
                            <a><b>Category</b></a>
                            <ul className="p-2">
                                <li className="text-white"><a onClick={handleCategoryPhone}>Phone</a></li>
                                <li className="text-white"><a onClick={handleCategoryVideo}>Video</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl text-white" onClick={handleHomePage}>Produku.id</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                <li className="text-white"><a onClick={handleHomePage}><b>Home</b></a></li>
                <li>
                    <details>
                        <summary className="text-white"><b>Category</b></summary>
                        <ul className="p-2">
                            <li><a onClick={handleCategoryPhone}>Phone</a></li>
                            <li><a onClick={handleCategoryVideo}>Video</a></li>
                        </ul>
                    </details>
                </li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full border-white">
                            {urlImageProfile != "" ? (
                            <Image
                                alt="Image User"
                                src={urlImageProfile}
                                width={100}
                                height={100}/>
                            ) :
                            (<Image
                                alt="Image User"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                                width={100}
                                height={100}/>)
                            }  
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between" onClick={handleChangeProfile}>Profile</a>
                        </li>
                        <li>
                            <a onClick={handleChangeLogout}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
       
        <Logout modalLogout={modalLogout} handleChangeLogout={handleChangeLogout}/>
        {
        users.length > 0 
        && 
        <Profile modalProfile={modalProfile} handleChangeProfile={handleChangeProfile} name={users[0].name!} phone={users[0].phone!} user_id={users[0].id!}/> 
        }
             
        </>   
    )
}