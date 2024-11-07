'use client'
import { useSearchParams } from "next/navigation";

export default function WelcomeMessage(welcomeMessage: WelcomeMessage){
    const searchParam = useSearchParams();
    const category = searchParam.get("category")!;
    return (
        <>
            {welcomeMessage.isAdmin ? (
            <p><b>Welcome to Admin Dashboard, {welcomeMessage.name}! </b></p>
            ) : category.toLowerCase() == "handphone" ? (
            <p><b>Welcome to handphone products, {welcomeMessage.name}!</b></p>
            ) : category.toLowerCase() == "video" ? (
            <p><b>Welcome to video products, {welcomeMessage.name}!</b></p>
            ) : 
            <></>
            }
        </>               
    )
}