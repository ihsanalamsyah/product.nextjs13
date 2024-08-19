'use client'

import moment from "moment";
import DeleteProduct from "@/app/components/products/deleteProduct";
import EnrollProduct from "@/app/components/products/enrollProduct";
import OpenProduct from "@/app/components/products/openProduct";
import UpdateProduct from "@/app/components/products/updateProduct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from '@/utils/cookies';


const route = process.env.NEXT_PUBLIC_ROUTE;

export default function TableProduct(tableProduct: TableProduct){
    const searchParam = useSearchParams();
    const [mapUserProducts, setMapUserProducts] = useState<MapUserProduct[]>([]);
    const [users, setUsers] = useState<Users[]>(tableProduct.users);
    const category = searchParam.get("category")!;
    const searchQuery = searchParam.get("search")!;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(false);
    const token = getCookie("token");
    const email = getCookie("email");
  
    async function getUserProduct(token: string, email: string, category: string, searchQuery: string) {
        let userAndProduct:MapUserProduct[] = [{
            product_id: 0,
            title: "",
            price: 0,
            quantity: 0,
            category: "",
            user_id: 0,
            enroll_date: null,
            user_id2: 0,
            name: "",
            email: "",
            password: "",
            gender: "",
            role: "",
            search: ""
        }];
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
    useEffect(()=>{    
        const fetchData =  async ()=>{   
            const mapUserProducts: MapUserProduct[] = await getUserProduct(token!, email!, category!, searchQuery!);
            setMapUserProducts(mapUserProducts);
            if(mapUserProducts.length <= 0){
                setIsProductEmpty(true);
            }
            if(tableProduct.users[0].role == "Admin"){
                setIsAdmin(true);
            }
        }
        fetchData();
    }, [category,searchQuery]);
   
    return (
        <>
          {isProductEmpty ? (
                isAdmin ? (
                    <div className="flex justify-center my-2"><p>Product is empty, Please add some</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is empty, Please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                {
                                 isAdmin ? (
                                    <th>Category</th>
                                    ) : (
                                    <></>
                                    )   
                                } 
                                <th>Product Name</th>
                                <th>Price</th>
                                {
                                    isAdmin ? (
                                        <th>Quantity</th>
                                    ) : (
                                    category == "Phone"  ? (
                                        <th>Quantity</th>
                                    ) : (
                                        <></>
                                    ) 
                                    )
                                }                  
                                <th>Action</th>
                                {
                                    isAdmin ? (
                                        <th>Enrolled By</th>
                                    ) : (
                                    category == "Video"  ? (
                                        <th>Enrolled By</th>
                                    ) : (
                                        <></>
                                    ) 
                                    )
                                }              
                            </tr>
                        </thead>
                        <tbody>                 
                        {mapUserProducts.map((mapUserProduct, index)=>{
                            const role = users[0].role;
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
                            if(role == "Admin"){
                                return(<tr key={mapUserProduct.product_id!}>
                                    <th>{index + 1}</th>
                                    {
                                        isAdmin ? (
                                            <th>{mapUserProduct.category!}</th>
                                        ) : (
                                            <></>
                                        )   
                                    }
                                    <th>{mapUserProduct.title!}</th>
                                    <th>{stringPrice}</th>
                                    <th>{mapUserProduct.quantity!}</th>
                                    <th className="flex">
                                        <UpdateProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!}/>
                                        <DeleteProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!}/>
                                        <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!}  category={mapUserProduct.category!}/>
                                    </th>
                                    {mapUserProduct.category! == "Video" ? (
                                        <th>{mapUserProduct.name ?? "No One"}</th>
                                    ) :(
                                        <th>This is Phone</th>
                                    )}             
                                </tr>)
                            }
                            else if (role == "User"){
                                if(dateDiff > 3 && mapUserProduct.category == "Video"){
                                    const product: Products = {
                                        id: mapUserProduct.product_id!,
                                        category: "",
                                        price: mapUserProduct.price!,
                                        title: mapUserProduct.title!,
                                        quantity: 0
                                    }
                                    return(<tr key={mapUserProduct.product_id!}>
                                        <th>{index + 1}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.category!}</th>
                                            ) : (
                                                <></>
                                            )   
                                        }
                                        <th>{mapUserProduct.title!}</th>
                                        <th>{stringPrice}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.quantity!}</th>
                                            ) : (
                                            category == "Phone"  ? (
                                                <th>{mapUserProduct.quantity!}</th>
                                            ) : (
                                                <></>
                                            ) 
                                            )
                                        }                    
                                        <th className="flex">
                                            <EnrollProduct user={users[0]} product={product}/>
                                        </th>
                                        {
                                            isAdmin ? (
                                                <th>{"No One"}</th>
                                            ) : (
                                            category == "Video"  ? (
                                                <th>{"No One"}</th>
                                            ) : (
                                                <></>
                                            ))
                                        } 
                                    </tr>)
                                }
                                else{
                                    const product: Products = {
                                        id: mapUserProduct.product_id!,
                                        category: "",
                                        price: mapUserProduct.price!,
                                        title: mapUserProduct.title!,
                                        quantity: 0
                                    }
                                    return(<tr key={mapUserProduct.product_id!}>
                                        <th>{index + 1}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.category!}</th>
                                            ) : (
                                                <></>
                                            )   
                                        }
                                        <th>{mapUserProduct.title!}</th>
                                        <th>{stringPrice}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.quantity!}</th>
                                            ) : (
                                                category == "Phone"  ? (
                                                    <th>{mapUserProduct.quantity!}</th>
                                                ) : (
                                                <></>
                                                ) 
                                            )
                                        }                            
                                        <th className="flex">
                                            <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!}/>             
                                        </th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.name ?? "No One"}</th>
                                            ) : (
                                                category == "Video"  ? (
                                                    <th>{mapUserProduct.name ?? "No One"}</th>
                                                ) : (
                                                <></>
                                                ) 
                                            )
                                        } 
                                    </tr>)
                                }
                            }
                        })}
                        </tbody>
                    </table>
                )} 
        </>    
    )
}