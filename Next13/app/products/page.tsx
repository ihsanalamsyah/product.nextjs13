'use client'

import AddProduct from "./addProduct";
import Logout from "./logout";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import { useSearchParams } from 'next/navigation';

type Product = {
    id: number;
    title: string;
    price: number;
}


const getProducts = async () => {
    try {
        const route = "http://localhost:4000";
        const searchParams = useSearchParams();
 
        const token = searchParams.get('token');
        
        const response = await fetch(`${route}/products`, {
            cache: 'no-store',
            method: 'GET',
            headers:{
                'Authorization': 'Bearer '+ token
            }
        });
       
        const content = await response.json();
        if(content.status == "OK"){
            return content.data;
        }
        else{
            alert(content.msg);
            return [];
        }
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

export default async function ProductList(){
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const products: Product[] = await getProducts();
    return (
        <div className="py-10 px-10">
            <div className="flex justify-center my-2">
                <p><b>Welcome to dashboard {name}!</b></p>
            </div>
            <div className="py-2 flex">             
                <AddProduct />
              
            </div>
            <table className="table w-full">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Product Nmae</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index)=>(
                    <tr key={product.id}>
                        <th>{index + 1}</th>
                        <th>{product.title}</th>
                        <th>{product.price}</th>
                        <th className="flex">
                            <UpdateProduct {...product}/>
                            <DeleteProduct {...product} />
                        </th>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="py-2 flex flex-row-reverse">         
                <Logout />
            </div>
        </div>
    )

    
}