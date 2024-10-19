'use client'

import SignUp from "@/app/components/signUp";
import SignIn from "@/app/components/signIn";
import FormResetPassword from "@/app/components/formResetPassword";
import BePartOfUs from "@/app/components/bePartOfUs"
import { useState } from "react";


export default function ResetPassword() {
  const [isShowSignIn, setIsShowSignIn] = useState(true);
  const [isShowResetPassword, setIsShowResetPassword] = useState(false);
  function toogleSignIn(){
    setIsShowSignIn(!isShowSignIn);
  }
  function toogleResetPassword(){
    setIsShowResetPassword(!isShowResetPassword);
  }
  return (
    <>
      <div className="lg:w-screen w-full h-screen bg-gradient-to-b from-gray-400 to-gray-900 ">
        <div className="flex justify-evenly m-auto h-screen items-center"> 
          <div className="w-1/3 relative text-center">
            <FormResetPassword onToogle={toogleResetPassword}/>
          </div>
        </div>
      </div>        
    </>
  );
}
