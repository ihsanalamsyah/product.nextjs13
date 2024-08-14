'use client'

export default function welcomeMessage(welcomeMessage: WelcomeMessage){
    return (
        <>
            {welcomeMessage.isAdmin ? (
            <p><b>Welcome to Dashboard Admin {welcomeMessage.name} </b></p>
            ) : (
            <p><b>Welcome to Dashboard User {welcomeMessage.name} </b></p>
            )}
        </>
                
    )
}