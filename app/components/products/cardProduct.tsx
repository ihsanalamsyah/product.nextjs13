'use client'

import moment from "moment";
import EnrollProduct from "@/app/components/products/enrollProduct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function CardProduct(cardProduct: CardProduct){
    const searchParam = useSearchParams();
    const [mapUserProducts, setMapUserProducts] = useState<MapUserProduct[]>([]);
    const [users, setUsers] = useState<Users[]>(cardProduct.users);
    const category = searchParam.get("category")!;
    const searchQuery = searchParam.get("search")!;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(false);
    const router = useRouter();

    async function getUserProduct(token: string, email: string, category: string, searchQuery: string) {
        let userAndProduct:MapUserProduct[] = [];
        try {             
            const response = await fetch(`${route}/mapUserProduct`, {
                method: 'POST',
                cache: 'no-store',
                headers:{
                    'Authorization': 'Bearer '+ token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    category: category,
                    search: searchQuery
                })
            });
            const content = await response.json();
            
            userAndProduct = content.data;
            
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
        return userAndProduct;
    };
    function handleOpen(product_id: number){
        return router.push(`products/${product_id}`); 
     }
    useEffect(()=>{    
        const fetchData =  async ()=>{    
            const token = getCookie("token");
            const email = getCookie("email");
            const mapUserProducts: MapUserProduct[] = await getUserProduct(token!, email!, category!, searchQuery!);
            setMapUserProducts(mapUserProducts);
            if(mapUserProducts.length <= 0){
                setIsProductEmpty(true);
            }
            if(cardProduct.users[0].role == "Admin"){
                setIsAdmin(true);
            }
        }
        fetchData();
    }, [category,searchQuery,cardProduct.users]);
   
    return (
        <>
          {isProductEmpty ? (
                isAdmin ? (
                    <div className="flex justify-center my-2"><p>Product is empty, Please add some</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is empty, Please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-4 grid-cols-1">   
                         {mapUserProducts.map((mapUserProduct)=>{
                            const today = new Date();
                            const enroll_date = mapUserProduct.enroll_date;            
                            const formattedToday = moment(today);
                            let dateDiff = 99999999;
                            if(mapUserProduct.enroll_date != null){
                                dateDiff = formattedToday.diff(enroll_date, 'days');
                            }
                            const price: number = mapUserProduct.price!;
                            let stringPrice:string = price.toString().replace(/\./g, '');
                            stringPrice = "Rp. "+ stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
                            if(dateDiff > 3 && mapUserProduct.category == "Video"){
                                const product: Products = {
                                    id: mapUserProduct.product_id!,
                                    category: mapUserProduct.category,
                                    price: mapUserProduct.price!,
                                    title: mapUserProduct.title!,
                                    quantity: mapUserProduct.quantity,
                                    image_url: mapUserProduct.image_url,
                                    video_url: mapUserProduct.video_url
                                }
                                return(<div className="card static bg-base-100 lg:w-80 shadow-xl lg:mx-5 lg:my-2" key={product.id}>
                                    <figure className="h-44 w-full bg-gray-200 flex">
                                        <Image
                                            src={product.video_url!}
                                            alt={`Product Image ${product.id}`}
                                            width={300}
                                            height={250}/>
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">
                                        {product.title}
                                        </h2>
                                        <p>Price: {stringPrice}</p>
                                        <div className="card-actions justify-end">
                                            <EnrollProduct user={users[0]} product={product}/>
                                        </div>
                                    </div>
                                    </div>)
                            }
                            else{
                                const product: Products = {
                                    id: mapUserProduct.product_id!,
                                    category: mapUserProduct.category,
                                    price: mapUserProduct.price!,
                                    title: mapUserProduct.title!,
                                    quantity: mapUserProduct.quantity,
                                    image_url: mapUserProduct.image_url,
                                    video_url: mapUserProduct.video_url
                                }
                                return(<div className="card static bg-base-100 lg:w-80 shadow-xl lg:mx-5 lg:my-2" key={product.id}>
                                    <figure className="h-44 w-full bg-gray-200">
                                        {product.category == "Video" ? (
                                            <Image
                                                src={product.video_url!}
                                                alt={`Product Image ${product.id}`}
                                                width={300}
                                                height={250}/>
                                        ) : (
                                            <Image
                                                src={product.image_url!}
                                                alt={`Product Image ${product.id}`}
                                                width={300}
                                                height={250}/>
                                        )}
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">
                                        {product.title}
                                        {product.category == "Video" ? (
                                            <div className="badge badge-secondary">Enrolled</div>
                                        ) : (
                                            <></>
                                        )}
                                        </h2>
                                        <p>Price: {stringPrice}</p>
                                        <div className="card-actions justify-end">
                                        {product.category == "Video" ? (
                                            <button className="btn btn-success mx-1 w-max" onClick={()=> handleOpen(product.id!)}>Watch Now</button>
                                        ) : (
                                            <button className="btn btn-success mx-1 w-max" onClick={()=> handleOpen(product.id!)}>Open Product</button>
                                        )}  
                                        </div>
                                    </div>
                                </div>)
                            }
                        })}
                    </div>
                )} 
        </>    
    )
}