'use client'

import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    title: string;
    price: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    password: string;
    role: string;
}

interface UserProduct {
    id: number;
    product_id: number;
    user_id: number;
    enroll_date: Date;
    Product: Product;
    User: User;
}

interface EnrollProduct{
    user: User;
    product: Product;
}

export default function EnrollProduct(product: Product){
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
            <button className="btn btn-success btn-sm" onClick={()=> handleOpen(product.id)}>Open detail product</button>
        </div>
    )
}