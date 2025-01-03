'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useContext, createContext } from "react";
import Profile from "@/app/components/products/profile";
import { supabase } from '@/utils/supabase';
import { getCookie, deleteCookie } from '@/utils/cookies';
import WelcomeMessage from "@/app/components/products/welcomeMessage";
import AddProduct from "@/app/components/products/addProduct";
import TableProduct from "@/app/components/products/tableProduct";
import Tracker from "@/app/components/products/tracker";
import ModalProcess from "@/app/components/modalProcess";
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from '@/app/styles/drawer.module.css';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetUserDetail(token: string, email: string){
    let user: Users[] = [];    
    try {             
        const response = await fetch(`${route}/userDetail`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const content = await response.json();
        
        user = content.data;
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return user;
}
async function GetImageUrl(user_id:number){
    let imageUrl:string = "";
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(`Foto-user-user_id-${user_id}.png`)

    if(data.publicUrl != ""){
        imageUrl = data.publicUrl;
    }
    return imageUrl;
}
async function CheckImageUrl(token:string, image_url:string){
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

export default function Drawer(){
    const [modalProfile, setModalProfile] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [urlImageProfile, setUrlImageProfile] = useState("");
    const [users, setUsers] = useState<Users[]>([]);
    const [tableDataUpdated, setTableDataUpdated] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const token = getCookie("token");
    const [isSuccessImage, setIsSuccessImage] = useState(false);
    const [page, setPage] = useState("");
    const [isDrawerOpen, setDrawerOpen] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    function handleHomePage(){
        if(users[0].role == "Admin"){
            return router.push("/admin");
        }     
        else{
            return router.push("/products?category=handphone");
        }    
    }
    function handleTrackerPage(){
        return router.push("/tracker");
    }
    const handleChangeProfile = () => setModalProfile(!modalProfile);

    const handleChangeLogout = () => handleLogout(token!);

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => setIsHovered(false);

    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

    const handleUpdateTable = () => setTableDataUpdated(!tableDataUpdated);

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
    function doProcessing(isOpen:boolean){
        setIsProcessing(isOpen);
    }
    useEffect(()=>{
        const fetchData =  async ()=>{ 
            const token = getCookie("token");
            const email = getCookie("email");
            const user = await GetUserDetail(token!, email!);
            const imageUrl:string = await GetImageUrl(user[0]?.id!);
            setUrlImageProfile(imageUrl);
            const isSuccessImage = await CheckImageUrl(token!, imageUrl);
            setIsSuccessImage(isSuccessImage);
            if(user[0]?.role == "Admin")
                setIsAdmin(true);

            setPage(window.location.pathname.replace("/",""));
            setUsers(user);
        }
        fetchData();
    }, [isAdmin, tableDataUpdated]);
    return (
        <>
        <ModalProcess isProcessing={isProcessing} onProcessing={doProcessing}/>
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer}/>
            <div className="drawer-content flex flex-col items-center">
                <div className="navbar">
                    <div className="navbar-start">
                        <label htmlFor="my-drawer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md transition block lg:hidden" onChange={toggleDrawer}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-700"
                                width="32"
                                height="32"
                                viewBox="0 0 512 512">
                                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                            </svg>
                        </label>
                    </div>            
                    <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border-white">
                                {isSuccessImage ? (
                                    <Image
                                        alt="Image User"
                                        src={urlImageProfile}
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <Image
                                        alt="Image User"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        width={100}
                                        height={100}
                                    />
                                )}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <a onClick={handleChangeProfile}><AccountCircleIcon /><p>Profile</p></a>
                            </li>
                            <li>
                                <a onClick={handleChangeLogout}><LogoutIcon /><p>Logout</p></a>
                            </li>
                        </ul>
                    </div>
                    </div>
                </div>
                { page == "admin" ? (
                    <div className="py-10 px-10 mt-2 w-full">
                        <div className="flex justify-center my-2">
                            <WelcomeMessage name={users[0].name!} isAdmin={isAdmin}/>  
                        </div> 
                        <div className="py-2 flex flex-row-reverse">
                            <AddProduct isVisible={isAdmin} onUpdateTable={handleUpdateTable} onProcessing={doProcessing}/>
                        </div>
                        <hr></hr>
                        <div>
                            <TableProduct users={users} onUpdateTable={handleUpdateTable} isUpdateTable={tableDataUpdated}/>
                        </div>         
                    </div> 
                ) : page == "tracker" ? ( 
                    <div className="py-10 px-10 mt-2 w-full">
                        <Tracker  />
                    </div> 
                ) : (<></>)}   
            </div>
            <div className={`drawer-side ${isDrawerOpen ? styles.drawerSideOn : ''}`}>
                <ul className="menu bg-gray-800 text-white min-h-full w-56 p-4 space-y-4 shadow-lg">                 
                    <li>
                        <a onClick={handleHomePage} className={`flex items-center ${styles.activeNone}`}>
                            <p className="text-xl font-semibold">Produku.id</p>
                        </a>
                    </li>
                    {page == "admin" ? (
                    <> 
                        <li>
                            <a onClick={handleHomePage} className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
                                <HomeIcon className="text-white" />
                                <p className="text-lg font-extrabold hover:font-extrabold">Home</p>
                            </a>
                        </li>
                        <li>
                            <a 
                                onClick={handleTrackerPage} 
                                className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {isHovered ? (
                                    <TimelineOutlinedIcon className="text-white" />
                                ) : (
                                    <TimelineOutlinedIcon className="text-gray-300" />
                                )}
                                <p className="text-lg hover:font-extrabold">Tracker Handphone</p>
                            </a>
                        </li>
                    </>
                    ): page == "tracker"? (
                    <>
                        <li>
                            <a 
                                onClick={handleHomePage} 
                                className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {isHovered ? (
                                   <HomeIcon className="text-white" />
                                ) : (
                                    <HomeOutlinedIcon className="text-gray-300" />
                                )}
                                <p className="text-lg hover:font-extrabold">Home</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleTrackerPage} className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
                                <TimelineOutlinedIcon className="text-white" />
                                <p className="text-lg font-extrabold hover:font-extrabold">Tracker Handphone</p>
                            </a>
                        </li>
                    </>
                    ): (
                    <>
                        <li>
                            <a onClick={handleHomePage} className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
                                <HomeOutlinedIcon className="text-gray-300" />
                                <p className="text-lg">Home</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleTrackerPage} className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2">
                                <TimelineOutlinedIcon className="text-gray-300" />
                                <p className="text-lg">Tracker Handphone</p>
                            </a>
                        </li>
                    </>
                    )}  
                </ul>
            </div>
        </div>
        {users.length > 0 && 
        <Profile
            modalProfile={modalProfile} 
            handleChangeProfile={handleChangeProfile} 
            name={users[0]?.name!} 
            phone={users[0]?.phone!} 
            user_id={users[0]?.id!}
            onUpdateTable={handleUpdateTable}
            onProcessing={doProcessing}
        />
        }
        </>   
    )
}