'use server'
import Link from 'next/link';
import { cookies } from 'next/headers'
import { ChangeEvent } from 'react';
import DetailProduct from '@/app/components/products/[...product_id]/detailProduct'
import { notFound } from "next/navigation";
import ImageComponent from '@/app/components/products/[...product_id]/imageProduct';


async function getImageUrl(token: string | null | undefined,  product_id: number){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    let imageUrl = "";
    try{
        const response = await fetch(`${route}/getimage`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token ,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                product_id: product_id.toString()
            })
        }); 
        
        const content = await response.json();
        if(content.status == "OK"){
            const bufferObj = content.data;
            const uint8Array = new Uint8Array(bufferObj.data);
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
            imageUrl = URL.createObjectURL(blob);
            
        }
        else{
            alert(content.msg);
        }
        
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
    return imageUrl;
}

async function getProductById(token: any, product_id: any){
    let product: Products = {
       title: "",
       id: 0,
       price: 0
    };
    const route = process.env.NEXT_PUBLIC_ROUTE;
    try {
        
        const response = await fetch(`${route}/products?id=${product_id}`, {
            method: 'GET',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'            
            }
        });

        const content = await response.json();
        product = content.data[0];

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    return product;
}

export default async function ProductDetail({params}: {params: {product_id: number}}){

    let product_id = Number(params.product_id);
    
    if (product_id < 0  || isNaN(product_id)) {
      notFound();
    }
    const cookieStore = cookies()
    const token = cookieStore.get('token');
    const role = cookieStore.get('role');
    let isAdmin = false;
    if(role!.value == "Admin"){
        isAdmin = true;
    }
    const productDetail: Products = await getProductById(token!, params.product_id);
    const imageUrl = await getImageUrl(token!.value, params.product_id);
    const imageId = `image-product-${params.product_id}`;
    const imageAlt = `image product ${params.product_id}`;
    return(
        <div>
            {/* <ImageComponent isAdmin={isAdmin} product_id={params.product_id} token={token.value}> 
                <div className="flex">
                    <p>Image: </p>
                    <div id="container" className="d-flex rounded-full w-40 h-40 relative overflow-hidden">
                        <img className="object-cover" id={imageId} alt={imageAlt} src={imageUrl} />
                    </div>
                    
                </div>
            </ImageComponent> */}

            <br></br>

            <DetailProduct>
                <div className='flex justify-evenly'>
                    <p>Product title: {productDetail.title}</p>
                    <p>Product price: {productDetail.price}</p>   
                </div> 
            </DetailProduct>

            <br></br>
            <div className='flex justify-evenly'>
                <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>
                <p></p>
            </div>
            
        </div>
    )
}