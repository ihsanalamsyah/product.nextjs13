'use client'

import Link from 'next/link';

interface Product {
    params:{
        id: number;
        title: string;
        price: number;
    }
    
}
export default function ProductDetail({ params }: Product){
    
    return(
        <div>
            <p>Product id number: {params.id}</p>
            <p>Product title: {params.title}</p>
            <p>Product price: {params.price}</p>
            <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>         
        </div>
    ) 
}