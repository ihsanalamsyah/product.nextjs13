'use client'


interface WelcomeMessage {
    name: any,
    isAdmin: boolean
}


export default function welcomeMessage(welcomeMessage: WelcomeMessage){
    
    let isAdmin = false;
    const name = welcomeMessage.name as string;
    if(welcomeMessage.isAdmin){
        isAdmin = true;
    }
    
    return (
        <>
            {isAdmin ? (
                <p><b>Welcome to dashboard admin {name} </b></p>
            ) : (
                <p><b>Welcome to dashboard {name} </b></p>
            )}
        </>
    )
}