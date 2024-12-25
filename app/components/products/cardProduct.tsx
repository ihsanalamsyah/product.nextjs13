'use client'

import moment from "moment";
import EnrollProduct from "@/app/components/products/enrollProduct";
import OpenProduct from "@/app/components/products/openProduct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from '@/utils/cookies';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetUserProduct(token: string, email: string, category: string, searchQuery: string):Promise<MapUserProduct[]> {
    let userAndProduct:MapUserProduct[] = [];
    try {             
        const response = await fetch(`${route}/getAllProductUser`, {
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
export default function CardProduct(cardProduct: CardProduct){
    const searchParam = useSearchParams();
    const [mapUserProducts, setMapUserProducts] = useState<MapUserProduct[]>([]);
    const [users, setUsers] = useState<Users[]>(cardProduct.users);
    const category = searchParam.get("category")!;
    const searchQuery = searchParam.get("search")!;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(false);
    const router = useRouter();

    useEffect(()=>{    
        const fetchData =  async ()=>{    
            const token = getCookie("token");
            const email = getCookie("email");
            const mapUserProducts: MapUserProduct[] = await GetUserProduct(token!, email!, category!, searchQuery!);
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
    function handleOpen(product_id: number, category:string){
        return router.push(`products/${product_id}?category=${category?.toLowerCase()}`); 
     }
    return (
        <>
          {isProductEmpty ? (
                isAdmin ? (
                    <div className="flex justify-center my-2"><p>Product is empty, Please add some</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is empty, Please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <div className="grid gap-x-5 gap-y-4 lg:grid-cols-5 grid-cols-2">   
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
                            stringPrice = "Rp" + stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            if(dateDiff > 3 && mapUserProduct.category == "Video"){
                                const product: Products = {
                                    id: mapUserProduct.product_id!,
                                    category: mapUserProduct.category,
                                    price: mapUserProduct.price!,
                                    title: mapUserProduct.title!,
                                    description: mapUserProduct.description,
                                    quantity: mapUserProduct.quantity,
                                    image_url: mapUserProduct.image_url,
                                    video_url: mapUserProduct.video_url
                                }
                                return(
                                <div className="card static bg-base-100 lg:w-64 shadow-xl lg:mx-5 lg:my-2" key={product.id}>
                                    <figure className="lg:min-h-44 min-h-36 w-full bg-gray-200">
                                        <Image
                                            src={product.image_url!}
                                            alt={product.image_url! ? `Product Image ${product.id}` : ""}
                                            className="min-w-full min-h-full max-w-full max-h-full p-0 box-border border-none m-auto w-0 h-0"
                                            width={300}
                                            height={250}/>
                                    </figure>
                                    <div className="card-body lg:min-h-44 min-h-36 p-3">
                                        <p className="lg:text-base text-xs">{product.title}</p>
                                        <p className="lg:text-base text-xs font-bold">{stringPrice}</p>
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
                                    description: mapUserProduct.description,
                                    quantity: mapUserProduct.quantity,
                                    image_url: mapUserProduct.image_url,
                                    video_url: mapUserProduct.video_url
                                }
                                return(
                                <div className="card static bg-base-100 lg:w-64 shadow-xl lg:mx-5 lg:my-2" key={product.id}>
                                    <figure title={product.category == "Video" ? "Watch Now" : "Open Detail"} className="lg:min-h-44 min-h-36 w-full bg-gray-200">
                                        <Image
                                            src={product.image_url!}
                                            alt={product.image_url! != "" ? `Product Image ${product.id}` : ""}
                                            className="min-w-full min-h-full max-w-full max-h-full p-0 box-border border-none m-auto w-0 h-0 cursor-pointer"
                                            onClick={()=> handleOpen(product.id!, product.category!)}
                                            width={300}
                                            height={250}/>
                                    </figure>
                                    <div className="card-body lg:min-h-44 min-h-36 p-3">
                                        <p className="lg:text-base text-xs">
                                        {product.title}
                                        {product.category == "Video" ? (
                                            <div className="badge gap-2 px-3 py-1 text-xs font-semibold text-white bg-pink-500 rounded-lg shadow-md">Enrolled</div>
                                        ) : (
                                            <></>
                                        )}
                                        </p>
                                        <p className="lg:text-base text-xs font-bold">{stringPrice}</p>
                                        {product.category == "Video" ? (
                                        <>
                                        </>
                                        ) : (
                                        <div className="flex items-center">
                                            <div className="lg:text-base text-xs">{product.quantity} qty</div>
                                            <span className="w-1 h-1 block mx-1 rounded-full bg-gray-400"></span>
                                            <div className="lg:text-base text-xs">{mapUserProduct.sold_out} terjual</div>
                                        </div>
                                        )}
                                        <div className="card-actions justify-end">
                                            <OpenProduct id={product.id!} title={product.title!} price={product.price!} quantity={product.quantity!} description={product.description!} category={product.category!} video_url={""} image_url={""}/>  
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