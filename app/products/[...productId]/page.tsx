
import Link from 'next/link';
import { getCookie } from '../../../utils/cookies';
import ImageUploader from '../../components/products/[...productId]/imageProduct';
import { ChangeEvent } from 'react';
import { cookies } from 'next/headers';
import DetailProduct from '../../components/products/[...productId]/detailProduct';
import { notFound } from "next/navigation";
import ImageComponent from '../../components/products/[...productId]/imageProduct';

interface Product {
    id: number,
    title: string,
    price: number;
}


interface GetProduct {
    status: string,
    msg: string,
    data: Product  
}



async function getImageUrl(token: string | null | undefined,  productId: number){
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
                productId: productId.toString()
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
            //console.error("Error");
            alert(content.msg);
        }
        
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
    return imageUrl;
}

async function getProductById(token: string | null | undefined, productId: number){

    const route = process.env.NEXT_PUBLIC_ROUTE;
    try {

        const response = await fetch(`${route}/product`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({
                id: productId.toString()
            })
        });

        const content = await response.json();

        return content;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
}

export default async function ProductDetail({params}: {params: {productId: number}}){

    let productId2 = Number(params.productId);

    if (productId2 < 0  || isNaN(productId2)) {
      notFound();
    }
    const productID = params.productId;

    
    const cookieStore = cookies();
    
    const token = cookieStore.get('token') as any;
    const role = cookieStore.get('role') as any;
    let isAdmin = false;
    if(role.value == "Admin"){
        isAdmin = true;
    }
    const getProduct: GetProduct = await getProductById(token.value, params.productId);
    const imageUrl = await getImageUrl(token.value, params.productId);
    const imageId = `image-product-${params.productId}`;
    const imageAlt = `image product ${params.productId}`;
    return(
        <div>
            {/* <ImageComponent isAdmin={isAdmin} productId={params.productId} token={token.value}> 
                <div className="flex">
                    <p>Image: </p>
                    <div id="container" className="d-flex rounded-full w-40 h-40 relative overflow-hidden">
                        <img className="object-cover" id={imageId} alt={imageAlt} src={imageUrl} />
                    </div>
                    
                </div>
            </ImageComponent> */}

            <br></br>

            <DetailProduct>
                <div>
                    <p>Product id number: {getProduct.data.id}</p>
                    <p>Product title: {getProduct.data.title}</p>
                    <p>Product price: {getProduct.data.price}</p>   
                </div> 
            </DetailProduct>

            <br></br>
            <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>         
        </div>
    )
}