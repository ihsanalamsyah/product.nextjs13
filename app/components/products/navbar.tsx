'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Profile from "@/app/components/products/profile";
import { supabase } from '@/utils/supabase';
import { getCookie, deleteCookie } from '@/utils/cookies';
import { useSearchParams } from "next/navigation";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import ModalProcess from "@/app/components/modalProcess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetImageUrl(user_id:number):Promise<string>{
    let imageUrl:string = "";
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(`Foto-user-user_id-${user_id}.png`)

    if(data.publicUrl != ""){
        imageUrl = data.publicUrl;
    }
    return imageUrl;
}
async function CheckImageUrl(token:string, image_url:string):Promise<boolean>{
    let isSuccessImage = false;
    try{
        const response = await fetch(`${route}/checkContentProduct`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content_url: image_url
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            isSuccessImage = true;
        }
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return isSuccessImage;
}

async function GetCountCart(token:string, email:string):Promise<number>{
    let countCart:number = 0;
    try{
        const response = await fetch(`${route}/getAllCart`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            countCart = content.data.length;
        }
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return countCart;
}
export default function Navbar(navbar: Navbar){
    const searchParam = useSearchParams();
    const [tableDataUpdated, setTableDataUpdated] = useState<boolean>(false);
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const [modalProfile, setModalProfile] = useState<boolean>(false);
    const [urlImageProfile, setUrlImageProfile] = useState<string>("");
    const [countCart, setCountCart] = useState<number>(0);
    const [users, setUsers] = useState<Users[]>(navbar.users);
    const category = searchParam.get("category")!;
    const router = useRouter();
    const token = getCookie("token");
    const [isSuccessImage, setIsSuccessImage] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(searchParam.get("search")! ?? "");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    function handleHomePage(){
        if(users[0].role == "Admin"){         
            return router.push("/admin");
        }else{
            return router.push("/products?category=handphone");
        }   
    }
    function handleCartPage(){
        return router.push("/cart");
    }
    function handleCategoryPhone(){
        detailsRef.current!.removeAttribute("open");
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }else{
            return router.push("/products?category=handphone");
        }
    }
    function handleCategoryVideo(){ 
        detailsRef.current!.removeAttribute("open");
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }else{
            return router.push("/products?category=video");
        }
    } 
    const handleChangeProfile=()=> setModalProfile(!modalProfile);
    const handleChangeLogout = () => handleLogout(token!);

    const handleUpdateTable =() => setTableDataUpdated(!tableDataUpdated);

    function doProcessing(isOpen:boolean){
        setIsProcessing(isOpen);
    }

    function handleEnter(event: React.KeyboardEvent<HTMLInputElement>){
        if (event.key === 'Enter') {
            if(searchQuery != ""){
                if(users[0].role == "Admin"){
                    return router.push(`/products?search=${searchQuery}`);
                }else{
                    return router.push(`/search?search=${searchQuery}`);
                }
            }else{
                if(users[0].role == "Admin"){
                    return router.push(`/admin`);
                }else{
                    return router.push(`/products?category=handphone`);
                }
            }
        }
    };
    
    async function handleLogout(token:string){
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            deleteCookie("token");
            deleteCookie("email");
            deleteCookie("category");
            return router.push("/");
        }
        else{
            return router.push("/products");   
        }
    }
    useEffect(()=>{      
        const fetchData =  async ()=>{
            const token = getCookie("token");
            const email = getCookie("email");
            const imageUrl:string = await GetImageUrl(users[0]?.id!);
            setUrlImageProfile(imageUrl);
            const isSuccessImage = await CheckImageUrl(token!, imageUrl);
            setIsSuccessImage(isSuccessImage);
            const countCart= await GetCountCart(token!, email!);
            setCountCart(countCart ?? 0);
        }
        fetchData();
    }, [users]);
    return (
        <>
        <ModalProcess isProcessing={isProcessing} onProcessing={doProcessing}/>
        <div className="navbar bg-gray-900 fixed top-0 left-0 w-full z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white">
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
                        <li className="text-black"><a onClick={handleHomePage}><b>Home</b></a></li>
                        {users[0].role == "User" ? (
                            <li className="text-black">
                                <a><b>Categories</b></a>
                                <ul className="p-2">
                                    <li className="text-black"><a onClick={handleCategoryPhone}><p>Handphone</p></a></li>
                                    <li className="text-black"><a onClick={handleCategoryVideo}><p>Video</p></a></li>
                                </ul>
                            </li>
                        ) : (
                            <></>
                        )}        
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl text-white lg:flex hidden" onClick={handleHomePage}><InventoryIcon className="text-gray-300" /><p>Produku.id</p></a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li className="text-white hover:bg-gray-700 rounded-lg active:scale-95"><a onClick={handleHomePage}><b>Home</b></a></li>
                    {users[0].role == "User" ? (
                    <li>
                        <details ref={detailsRef}>
                            <summary className="text-white hover:bg-gray-700"><b>Categories</b></summary>
                            <ul className="p-2">
                                <li><a onClick={handleCategoryPhone}>Handphone</a></li>
                                <li><a onClick={handleCategoryVideo}>Video</a></li>
                            </ul>
                        </details>
                    </li>
                    ) : (
                    <></>
                    )}
                </ul>
            </div>
            <div className="navbar-end">
                {users[0].role == "User" ? (
                    <>
                    <div className="relative flex items-center mx-1">
                        <SearchOutlinedIcon className="absolute left-3 text-gray-400" />
                        <input type="text" placeholder="Search" value={searchQuery} className="input pl-10 input-bordered w-40 md:w-auto input-sm" onKeyDown={handleEnter}  onChange={(e) => setSearchQuery(e.target.value)}/>
                    </div>
                    </>                
                ) : (
                    <></>
                )}
                <div className="indicator mx-1 hover:bg-gray-700 p-2 cursor-pointer rounded-lg active:scale-95 active:shadow-md" onClick={handleCartPage}>
                    <ShoppingCartIcon className="text-gray-300" />
                    {countCart != 0 ? <span className="indicator-item badge badge-error text-white">{countCart}</span> : (<></>)}
                </div>
                <div className="dropdown dropdown-end mx-1">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-gray-700">
                        <div className="w-10 rounded-full border-white">
                            {isSuccessImage ? (
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
                            <a  onClick={handleChangeProfile}
                            >
                                <AccountCircleIcon/>
                                <p>Profile</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleChangeLogout}
                            >
                                <LogoutIcon/>
                                <p>Logout</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        {users.length > 0 && 
        <Profile 
            modalProfile={modalProfile} 
            handleChangeProfile={handleChangeProfile}
            name={users[0].name!} 
            phone={users[0].phone!} 
            user_id={users[0].id!} 
            onUpdateTable={handleUpdateTable}
            onProcessing={doProcessing}
        />
        }   
        </>   
    )
}