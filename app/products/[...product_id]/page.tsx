'use server'

import { cookies } from 'next/headers'
import DetailProductPhone from '@/app/components/products/[...product_id]/detailProductPhone';
import DetailProductVideo from '@/app/components/products/[...product_id]/detailProductVideo';
import ImageProduct from '@/app/components/products/[...product_id]/imageProduct';
import VideoProduct from '@/app/components/products/[...product_id]/videoProduct';
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";
import { supabase } from '@/utils/supabase';

const route = process.env.NEXT_PUBLIC_ROUTE;


async function getProductById(token: string, product_id: number){
    let product: Products = {
       title: "",
       id: 0,
       category: "",
       price: 0,
       quantity: 0
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

async function getUserByEmail(token:string, email:string){
    let user: Users = {
        name: "",
        password: "",
        email: "",
        gender: "",
        role: "",
        id: 0
     };
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
        user = content.data[0];

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    return user;
}

async function logout(token:string){
    let isSuccessLogout = false;
    try{
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            isSuccessLogout = true;
        }          
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return isSuccessLogout;
}

async function getImageUrl(product_id:number){
    let imageUrl:string = "";
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(`Foto-product_id-${product_id}.png`)

    if(data.publicUrl != ""){
        imageUrl = data.publicUrl;
    }
    return imageUrl;
}

async function getVideoUrl(product_id:number){
    let videoUrl:string = "";
    const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(`Video-product_id-${product_id}.mp4`)

    if(data.publicUrl != ""){
        videoUrl = data.publicUrl;
    }
    return videoUrl;
}

async function checkImageUrl(token:string, image_url:string){
    let isSuccessImage = false;
    try{
        const response = await fetch(`${route}/checkImage`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: image_url
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            isSuccessImage = true;
        }
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return isSuccessImage;
}

async function checkVideoUrl(token:string, video_url:string){
    let isSuccessImage = false;
    try{
        const response = await fetch(`${route}/checkVideo`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                video_url: video_url
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            isSuccessImage = true;
        }
    }catch(error) {
        console.error('Error fetching data:', error);
    }
    return isSuccessImage;
}

export default async function ProductDetail({params}: {params: {product_id: number}}){
    const getSession = await supabase.auth.getSession();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? "";
    const email = cookieStore.get('email')?.value ?? "";
    const product_id = Number(params.product_id);
    if (getSession.data.session == null){
        const isSuccessLogout = await logout(token);
        if(isSuccessLogout){
            console.log("Gak ada session");
            //redirect('/');
        }
    }  
    
    if (product_id < 0  || isNaN(product_id)) {
      notFound();
    }
     
    let isAdmin:boolean = false;
    let imageUrl:string = "";
    let altImage:string = "";
    let videoUrl:string = "";
    let isSuccessImage:boolean = false;
    let isSuccessVideo:boolean = false;

    const user:Users = await getUserByEmail(token, email);
    if(user.role! == "Admin"){
        isAdmin = true;
    }
    const productDetail: Products = await getProductById(token, params.product_id);
    if(productDetail.category == "Video"){
        videoUrl = await getVideoUrl(params.product_id);
        isSuccessVideo = await checkVideoUrl(token, videoUrl);
    }else{
        imageUrl = await getImageUrl(params.product_id);
        altImage = `Foto-product_id-${product_id}`;
        isSuccessImage = await checkImageUrl(token, imageUrl);
    }
    
    
    
    return(
        // <>
        // </>
        <>
            <Navbar category={""} />
            <div className='flex justify-around mt-16'>       
                {productDetail.category == "Video" ? (
                    <>
                     <DetailProductVideo title={productDetail.title!} price={productDetail.price!} id={productDetail.id!} quantity={productDetail.quantity!} />
                     <VideoProduct isVisible={true} video_url={videoUrl} /> 
                    </>  
                ) : (
                    <>
                     <DetailProductPhone title={productDetail.title!} price={productDetail.price!} id={productDetail.id!} quantity={productDetail.quantity!} />
                     <ImageProduct isVisible={isSuccessImage} image_url={imageUrl} image_alt={altImage} /> 
                    </>       
                )}
            </div>    
        </>
    )
}