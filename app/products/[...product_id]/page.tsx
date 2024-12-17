'use server'

import { cookies } from 'next/headers';
import DetailProductPhone from '@/app/components/products/[...product_id]/detailProductPhone';
import DetailProductVideo from '@/app/components/products/[...product_id]/detailProductVideo';
import ImageProduct from '@/app/components/products/[...product_id]/imageProduct';
import VideoProduct from '@/app/components/products/[...product_id]/videoProduct';
import Navbar from "@/app/components/products/navbar";
import { notFound } from "next/navigation";
import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetProductById(token: string, product_id: number):Promise<Products>{
    let product: Products = {
       title: "",
       id: 0,
       category: "",
       price: 0,
       description: "",
       quantity: 0,
       image_url: "",
       video_url: ""
    };
    try {
        const response = await fetch(`${route}/productDetail?id=${product_id}`, {
            method: 'POST',
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

async function GetUserDetail(token:string, email:string):Promise<Users[]>{
    let user: Users[] = [];
    try {
        const response = await fetch(`${route}/userDetail`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'            
            },
            body: JSON.stringify({
                email: email
            })
        });

        const content = await response.json();
        user = content.data;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    return user;
}

async function GetImageUrl(product_id:number, category:string):Promise<string>{
    let imageUrl:string = "";
    let getUrlImage:any;
    if(category == "Video"){
        getUrlImage = supabase.storage
            .from('videos')
            .getPublicUrl(`thumbnails/Thumbnail-video-product_id-${product_id}.jpg`);
    }else{
        getUrlImage = supabase.storage
            .from('images')
            .getPublicUrl(`Foto-product-product_id-${product_id}.png`);
    }

    if(getUrlImage.data.publicUrl != ""){
        imageUrl = getUrlImage.data.publicUrl;
    }
    return imageUrl;
}

async function GetVideoUrl(product_id:number):Promise<string>{
    let videoUrl:string = "";
    const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(`Video-product-product_id-${product_id}.mp4`)

    if(data.publicUrl != ""){
        videoUrl = data.publicUrl;
    }
    return videoUrl;
}

async function CheckContentProduct(token:string, content_url:string):Promise<boolean>{
    let isSuccess = false;
    try{
        const response = await fetch(`${route}/checkContentProduct`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content_url: content_url
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            isSuccess = true;
        }
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return isSuccess;
}
export default async function ProductDetail({params}: {params: {product_id: number}}){
    
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? "";
    const email = cookieStore.get('email')?.value ?? "";
    const product_id = Number(params.product_id);
    
    
    if (product_id <= 0  || isNaN(product_id)) {
        notFound();
    }
    let image_url:string = "";
    let video_url:string = "";

    const users:Users[] = await GetUserDetail(token, email);
   
    const productDetail: Products = await GetProductById(token, params.product_id);
    let isVisible = false;
    if(productDetail.category == "Video"){
        video_url = await GetVideoUrl(params.product_id);
        image_url = await GetImageUrl(params.product_id, productDetail.category!);
        const success = await CheckContentProduct(token, video_url);
        if(success){
            isVisible = true
        }
    }else{
        image_url = await GetImageUrl(params.product_id, productDetail.category!);
        const success = await CheckContentProduct(token, image_url);
        if(success){
            isVisible = true
        }
    }
    const getSession = await supabase.auth.getSession();
    if (getSession.data.session == null){
        console.error("Gak ada session");  
        //return redirect('/');
    }  
    return(
        // <>
        // </>
        <>
            <Navbar users={users} />
            <div className="mt-16">       
                {productDetail.category == "Video" ? (
                    <div className="flex lg:flex-row flex-col">
                        <VideoProduct isVisible={isVisible} video_url={video_url} image_url={image_url} /> 
                        <DetailProductVideo title={productDetail.title!} price={productDetail.price!} id={productDetail.id!} quantity={productDetail.quantity!} description={productDetail.description!}/>
                    </div>  
                ) : (
                    <div className="flex lg:flex-row flex-col-reverse">
                        <DetailProductPhone title={productDetail.title!} price={productDetail.price!} id={productDetail.id!} quantity={productDetail.quantity!} description={productDetail.description!}/>
                        <ImageProduct isVisible={isVisible} image_url={image_url} image_alt={isVisible ? `Product Image ${productDetail.id}` : ""} /> 
                    </div>       
                )}
            </div>    
        </>
    )
}