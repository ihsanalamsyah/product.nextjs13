'use client'

import { useRouter } from 'next/navigation';



export default function EnrollProduct(product: Products){
    const router = useRouter();
    
    function handleOpen(productId: number){
    //    return router.push({
    //     pathname: `products/${productId}`,
    //     query: { productId: productId }
    //     });
       return router.push(`products/${productId}`); 
    }
    return (
        <div>
            <button className="btn btn-success btn-sm" onClick={()=> handleOpen(product.id!)}>Open detail product</button>
        </div>
    )
}