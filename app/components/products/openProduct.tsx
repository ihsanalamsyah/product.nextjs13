'use client'

import { useRouter } from 'next/navigation';

export default function OpenProduct(product: Products){
    const router = useRouter();
    
    function handleOpen(product_id: number){
       return router.push(`products/${product_id}`); 
    }
    return (
        <div>
            <button className="btn btn-success btn-sm mx-1" onClick={()=> handleOpen(product.id!)}>Open Detail Product</button>
        </div>
    )
}