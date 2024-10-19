'use client'
import Head from 'next/head';
import Script from 'next/script';
import { useState, SyntheticEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { setCookie } from '../../utils/cookies';
import { supabase } from "@/utils/supabase";

interface DecodedToken {
  sub: string;
  name: string;
  picture: string;
  email: string;
}

export default function GoogleSignIn(){
  const [isLoad, setIsLoad] = useState(false);
  useEffect(() => {
    setIsLoad(true);
  }, [isLoad]);

  async function handleSignInWithGoogle(response) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
  }

    return (
        <>
        {isLoad ? (
        <>
          <div
            id="g_id_onload"
            data-client_id="382388236597-cm20345fj4bqid3el0mt9ut3vogl52nt.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleSignInWithGoogle"
            data-nonce=""
            data-auto_select="true"
            data-itp_support="true"
            data-use_fedcm_for_prompt="true">
          </div>

          <div className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left">
          </div>
        </>
      ) : (
        <div></div>
      )}
      
        </>
       
    )
}