'use client'

import moment from "moment";
import DeleteProduct from "@/app/components/products/deleteProduct";
import EnrollProduct from "@/app/components/products/enrollProduct";
import OpenProduct from "@/app/components/products/openProduct";
import UpdateProduct from "@/app/components/products/updateProduct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from '@/utils/cookies';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const route = process.env.NEXT_PUBLIC_ROUTE;
async function GetUserProduct(token: string, email: string, category: string, searchQuery: string, orderBy1:string, orderBy2:string, orderDirection:string):Promise<MapUserProduct[]> {
    let userAndProduct:MapUserProduct[] = [];
    try {           
        const response = await fetch(`${route}/getAllProductAdmin`, {
            method: 'POST',
            cache: 'no-store',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                category: category,
                search: searchQuery,
                order_by1: orderBy1,
                order_by2: orderBy2,
                order_direction: orderDirection
            })
        });
        const content = await response.json();
        
        userAndProduct = content.data;
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return userAndProduct;
};
export default function TableProduct(tableProduct: TableProduct){
    const searchParam = useSearchParams();
    const [mapUserProducts, setMapUserProducts] = useState<MapUserProduct[]>([]);
    const [users, setUsers] = useState<Users[]>(tableProduct.users);
    const category = searchParam.get("category")!;
    const searchQuery = searchParam.get("search")!;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(false);
    const [orderBy1, setOrderBy1] = useState("category");
    const [orderBy2, setOrderBy2] = useState("title");
    const [orderDirection, setOrderDirection] = useState(true);

    useEffect(()=>{    
        const fetchData =  async ()=>{    
            const token = getCookie("token");
            const email = getCookie("email");
            const mapUserProducts: MapUserProduct[] = await GetUserProduct(token!, email!, category!, searchQuery!, orderBy1, orderBy2, orderDirection ? "asc" : "desc");
            setMapUserProducts(mapUserProducts);
            if(mapUserProducts.length <= 0){
                setIsProductEmpty(true);
            }
            if(tableProduct.users[0].role == "Admin"){
                setIsAdmin(true);
            }
        }
        fetchData();
    }, [category, searchQuery, orderBy1, orderBy2, orderDirection, tableProduct.users, tableProduct.isUpdateTable]);

    const handleUpdateTable = () => tableProduct.onUpdateTable();
    
    function handleSort(sortByParam1:string, sortByParam2:string){
        setOrderBy1(sortByParam1);
        setOrderBy2(sortByParam2);
        setOrderDirection(!orderDirection);
    }
    function SortIcon({ orderByParam }){
        if(orderByParam == orderBy1){
            if(orderDirection){
                return(<ArrowUpwardIcon className="w-4 h-4 inline-block ml-1" />)
            }else{
                return(<ArrowDownwardIcon className="w-4 h-4 inline-block ml-1" />)
            }
        }else{
            return(<ArrowUpwardIcon className="w-4 h-4 inline-block ml-1" />)
        }
    };
    return (
        <>
          {isProductEmpty ? (
                isAdmin ? (
                    <div className="flex justify-center my-2"><p>Product is empty, Please add some</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is empty, Please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <table className="table w-full whitespace-nowrap">
                        <thead>
                            <tr>
                                <th>No</th>
                                {isAdmin && 
                                    <th title="Order By Category"><button onClick={() => handleSort("category", "title")}>Category <SortIcon orderByParam="category" /></button></th>
                                }
                                <th title="Order By Product Name"><button onClick={() => handleSort("title", "category")}>Product Name <SortIcon orderByParam="title" /></button></th>
                                <th>Price</th>
                                {(isAdmin || category === "Handphone") && 
                                    <th>Quantity</th>
                                }
                                <th>Action</th>
                                {(isAdmin || category === "Video") && 
                                    <th>Enrolled By</th>
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
                            stringPrice = "Rp"+ stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                                    <th className="w-fit">{stringPrice}</th>
                                    <th>{mapUserProduct.quantity!}</th>
                                    <th className="flex">
                                        <UpdateProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!} description={mapUserProduct.description!} video_url={""} image_url={""} onUpdateTable={handleUpdateTable}/>
                                        <DeleteProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!} description={mapUserProduct.description!} video_url={""} image_url={""} onUpdateTable={handleUpdateTable}/>
                                        <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!}  category={mapUserProduct.category!} description={mapUserProduct.description!} video_url={""} image_url={""}/>
                                    </th>

                                    {mapUserProduct.category! == "Video" ? (
                                        <th>{dateDiff > 3 || mapUserProduct.name != null ? "No One" : mapUserProduct.name }</th>
                                    ) :(
                                        <th>Product handphone</th>
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
                                        description: mapUserProduct.description,
                                        quantity: 0,
                                        image_url: "",
                                        video_url: ""
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
                                        <th className="w-fit">{stringPrice}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.quantity!}</th>
                                            ) : (
                                            category == "Handphone"  ? (
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
                                        <th className="w-fit">{stringPrice}</th>
                                        {
                                            isAdmin ? (
                                                <th>{mapUserProduct.quantity!}</th>
                                            ) : (
                                                category == "Handphone"  ? (
                                                    <th>{mapUserProduct.quantity!}</th>
                                                ) : (
                                                <></>
                                                ) 
                                            )
                                        }                            
                                        <th className="flex">
                                            <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} quantity={mapUserProduct.quantity!} category={mapUserProduct.category!} description={mapUserProduct.description!} video_url={""} image_url={""}/> 
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