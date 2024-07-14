'use client'

import { useRouter } from 'next/navigation';



export default function EnrollProduct(product: Products){
    const router = useRouter();
    
    function handleOpen(product_id: number){
       return router.push(`products/${product_id}`); 
    }
    return (
        <div>
            <button className="btn btn-success btn-sm" onClick={()=> handleOpen(product.id!)}>Open detail product</button>
        </div>
    )
}