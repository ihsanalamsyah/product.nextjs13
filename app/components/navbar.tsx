'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from '@/utils/cookies';
import Image from "next/image";

export default function Navbar(navbar: Navbar){
    
    const [modal, setModal] = useState(false);
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const router = useRouter();
    const token = getCookie("token");
    function handleChange(){
        setModal(!modal);
    }
    async function handleLogout(){
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            setModal(false);
            return router.push("/");
        }
        else{       
            setModal(false);
            alert(content.msg);
            return router.push("/products?category=Phone");   
        }  
    }

    function handleHomePage(){
        return router.push("/products?category=Phone");
    }
    function handleCategoryPhone(){
        return router.replace("/products?category=Phone");
    }
    function handleCategoryVideo(){
        return router.replace("/products?category=Video");
    }
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
                            <Image
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                                width={100}
                                height={100}/>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a onClick={handleChange}>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Are you sure to logout?</h3>                                    
                <div className="modal-action">
                    <button type="button" className="btn" onClick={handleChange}>
                        Close
                    </button>
                    <button type="button" onClick={handleLogout} className="btn btn-primary">
                        Yes
                    </button>                                                       
                </div>
            </div>
        </div>
        </>   
    )
}