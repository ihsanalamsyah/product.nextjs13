'use client'
import { useSearchParams, usePathname } from "next/navigation";

export default function WelcomeMessage(welcomeMessage: WelcomeMessage){
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const category = searchParam.get("category") ?? "";
    return (
        <>
            {welcomeMessage.isAdmin ? (
            <>
                <p className="font-bold text-base hidden lg:block">Welcome to dashboard admin, {welcomeMessage.name}!</p>
                <p className="font-bold text-lg block lg:hidden">Dashboard admin</p>
            </>
            ) : category.toLowerCase() == "handphone" ? (
            <>
                <p className="font-bold text-base hidden lg:block">Welcome to product handphone, {welcomeMessage.name}!</p>
                <p className="font-bold text-lg block lg:hidden">Product phone</p>
            </>
            ) : category.toLowerCase() == "video" ? (
            <>
                <p className="font-bold text-base hidden lg:block">Welcome to product video, {welcomeMessage.name}!</p>
                <p className="font-bold text-lg block lg:hidden">Product video</p>
            </>
            ) : pathName == "/search" ? (
            <>
                <p className="font-bold text-base hidden lg:block">Welcome to search product</p>
                <p className="font-bold text-lg block lg:hidden">Search Product</p>
            </>
            ) : ( 
            <></>
            )}
        </>               
    )
}