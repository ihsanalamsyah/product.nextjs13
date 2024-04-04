'use client'

import Link from 'next/link';
import { getCookie } from '../../../../utils/cookies';
import { useState, useEffect } from "react";

interface Product {
    id: number;
    title: string;
    price: number;
}

interface DetailProduct {
    productId: number;
    
}





export default async function DetailProduct({children } : any){
 
 
    return(
        <>
            <div>{children}</div>
        </>
    )
}