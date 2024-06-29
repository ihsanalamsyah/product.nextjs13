'use client'
import Head from 'next/head';
import Script from 'next/script';
import { useState, SyntheticEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '../../utils/cookies';
import jwtDecode from 'jwt-decode';


interface DecodedToken {
  sub: string;
  name: string;
  picture: string;
  email: string;
}

export default function GoogleSignIn(){
    // const onSignIn = (response: any) => {
    //     const tokens = response.credential.split(".");
    //     const responsePayload = JSON.parse(atob(tokens[1]));
    //     console.log("ID: " + responsePayload.sub);
    //     console.log('Full Name: ' + responsePayload.name);
    //     console.log('Given Name: ' + responsePayload.given_name);
    //     console.log('Family Name: ' + responsePayload.family_name);
    //     console.log("Image URL: " + responsePayload.picture);
    //     console.log("Email: " + responsePayload.email);
    //     console.log("token: " + encodeURIComponent(tokens[1]))
    //     // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     // console.log('Name: ' + profile.getName());
    //     // console.log('Image URL: ' + profile.getImageUrl());
    //     // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    //   };
    //   useEffect(() => {
    //     /* Initialize Google Sign-In */
    //     const handleLoad = () => {
    //         console.log("asd");
    //         if (window.google) {
    //             window.google.accounts.id.initialize({
    //               client_id: '507909387104-c04gsjipd57or5uuoeie1d95kqb60s3d.apps.googleusercontent.com',
    //               callback: onSignIn,
    //             });
          
    //             window.google.accounts.id.renderButton(
    //               document.getElementById('signInButton') as HTMLElement,
    //               { theme: 'outline', size: 'large' }
    //             );
    //         }
    //         if (document.readyState === 'complete') {
    //           handleLoad();
    //         } else {
    //           window.addEventListener('load', handleLoad);
    //           return () => window.removeEventListener('load', handleLoad);
    //         }
    //       };
          
    //   }, []);
    
    return (
        <></>
        // <div>
        //     <Script
        //         src="https://accounts.google.com/gsi/client"
        //         strategy="afterInteractive"
        //         onLoad={() => {
        //         if (window.google) {
        //             window.google.accounts.id.initialize({
        //               client_id: '507909387104-c04gsjipd57or5uuoeie1d95kqb60s3d.apps.googleusercontent.com',
        //               callback: (response) => {
        //                 const tokens = response.credential.split(".");
        //                 const responsePayload = JSON.parse(atob(tokens[1]));
        //                 console.log("ID: " + responsePayload.sub);
        //                 console.log('Full Name: ' + responsePayload.name);
        //                 console.log('Given Name: ' + responsePayload.given_name);
        //                 console.log('Family Name: ' + responsePayload.family_name);
        //                 console.log("Image URL: " + responsePayload.picture);
        //                 console.log("Email: " + responsePayload.email);
        //               },
        //             });

        //             window.google.accounts.id.renderButton(
        //             document.getElementById('signInButton') as HTMLElement,
        //               { theme: 'outline', size: 'large' }
        //             );
        //         }
        //       }}
        //     />
        //     <div id="signInButton"></div>
        // </div>
    )
}