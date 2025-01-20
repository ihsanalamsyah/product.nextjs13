'use client'

import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function OpenProduct(product: Products){
    const router = useRouter();
    const [page, setPage] = useState(window.location.pathname.replace("/",""));
    function handleOpen(product_id: number){
       return router.push(`products/${product_id}?category=${product.category?.toLowerCase()}`); 
    }
    return (
        <div>
            {product.category == "Video" ? (
            <button className={`btn btn-info ${page == "admin" ? `btn-sm`: `lg:btn-sm btn-xs`} mx-1 w-max`} onClick={()=> handleOpen(product.id!)}>Watch Now</button>
            ): (
            <button className={`btn btn-success ${page == "admin" ? `btn-sm`: `lg:btn-sm btn-xs`} mx-1 w-max`} onClick={()=> handleOpen(product.id!)}>Open Detail</button>
            )}
        </div>
    )
}