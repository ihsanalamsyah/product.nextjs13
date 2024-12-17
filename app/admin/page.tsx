'use server'

import Drawer from "@/app/components/products/drawer";
import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';

export default async function Admin(){
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.error("Gak ada session");
        //return redirect('/');
    }
        
    return (
        <>
        <Drawer />
        </>
    )
}

