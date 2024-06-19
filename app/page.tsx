'use client'
import SignIn from "./components/signIn";
import Login from "./components/login";
import GoogleSignIn from "./components/googleSignIn";

export default function Home() {
 
  return (
    <>
      
      <div className="py-2 flex">
        <SignIn />
        <Login />
        <GoogleSignIn />
      </div>
      
    </>
  );
}
