'use client'

import Link from 'next/link';

export default function BackToDashboard(){
    
    return (
        <div className='flex flex-row-reverse mx-10'>
            <Link href="/products?category=Phone"><button className="btn btn-error btn-sm">&lt; Back To Dashboard</button></Link>
        </div>
    )
}