'use client'

import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import GoogleSignIn from "./components/googleSignIn";
import ResetPassword from "@/app/components/resetPassword";
import BePartOfUs from "./components/bePartOfUs";
import { useState } from "react";


export default function Home() {
  const [isShowSignIn, setIsShowSignIn] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  function toogleSignIn(){
    setIsShowSignIn(!isShowSignIn);
  }
  function toogleResetPassword(){
    setIsResetPassword(!isResetPassword);
  }
  return (
    <>
      <div className="lg:w-screen w-full h-screen bg-gradient-to-b from-gray-400 to-gray-900 ">
        <div className="flex justify-evenly m-auto h-screen items-center">
          <div className="w-1/3 relative lg:left-72 left-4">
            <BePartOfUs />
          </div> 
          <div className="border-r-2 border-white h-1/2">   
          </div>     
          <div className="w-1/3 relative lg:right-24 right-2">
            {isShowSignIn ? ( isResetPassword ?
              (<ResetPassword onToogle={toogleResetPassword}/>) : 
              (<SignIn onToogle={toogleSignIn} onToogleResetPassword={toogleResetPassword}/>)): 
              (<SignUp onToogle={toogleSignIn}/>)
            }
          </div>
          {/* <div>
          <GoogleSignIn /> 
          </div> */}
        </div>
      </div>        
    </>
  );
}
