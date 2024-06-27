'use client'


export default function welcomeMessage(welcomeMessage: WelcomeMessage){
    
    let isAdmin = false;
    const name = welcomeMessage.name;
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