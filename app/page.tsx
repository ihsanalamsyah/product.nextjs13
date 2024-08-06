'use client'

import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import GoogleSignIn from "./components/googleSignIn";
import BePartOfUs from "./components/bePartOfUs";
import { useState } from "react";


export default function Home() {
  const [isShowSignIn, setIsShowSignIn] = useState(true);

  function toogleSignIn(){
    setIsShowSignIn(!isShowSignIn);
  }
  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-gray-400 to-gray-900">
        <div className="flex justify-evenly m-auto h-screen items-center">
          <div className="w-1/3 relative left-96">
            <BePartOfUs />
          </div> 
          <div className="border-r-2 border-white h-1/2 w-1/3 relative right-52">
        
          </div>
          <div className="w-1/3 relative right-36">
            {isShowSignIn ? (
              <SignIn onToogle={toogleSignIn}/>
              ): (
              <SignUp onToogle={toogleSignIn}/>
            )}
          </div>
        </div>
      </div>        
    </>
  );
}
