'use client'

import FormResetPassword from "@/app/components/formResetPassword";

export default function ResetPassword() {

  return (
    <>
      <div className="lg:w-screen w-full h-screen bg-gradient-to-b from-gray-400 to-gray-900 ">
        <div className="flex justify-evenly m-auto h-screen items-center"> 
          <div className="w-1/3 relative text-center">
            <FormResetPassword/>
          </div>
        </div>
      </div>        
    </>
  );
}
