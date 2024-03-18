'use client'

import AddProduct from "./addProduct";
import Logout from "./logout";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import { useSearchParams } from 'next/navigation';
import { getCookie } from '../../utils/cookies';


interface Product {
    id: number;
    title: string;
    price: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    password: string;
    role: string;
}

interface UserProduct {
    id: number;
    product_id: number;
    user_id: number;
    enroll_date: Date;
    Product: Product;
    User: User;
}

interface GetUserProduct{
    user: User;
    user_products: UserProduct[];
}

const getProducts = async (token: string | null | undefined, name: string | null | undefined) => {

    const route = "http://localhost:4000/api";
    try {
               
        const response = await fetch(`${route}/getusergetproducts`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        });
       
        const content = await response.json();
        
        return content;
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

export default async function ProductList(){
    const token = getCookie("token");
    const name = getCookie("name");
    const allResult: GetUserProduct = await getProducts(token, name);
   
    let welcomeword;
    let addProduct;
    let tableDiv;
    if(allResult.user.role == "Admin"){
        welcomeword = <p><b>Welcome to dashboard admin {name}!</b></p>
        addProduct =  <div className="py-2 flex"><AddProduct /></div>
        if(allResult.user_products.length <= 0){
            tableDiv = <div><p>Product is zero why not add some ?</p></div>
        }
        else{
            //isi table div beneran
            tableDiv = <div></div>
        }
    }      
    else{
        welcomeword = <p><b>Welcome to dashboard {name}!</b></p>
        addProduct =  <div className="py-2 flex"></div>
        if(allResult.user_products.length <= 0){
            tableDiv = <div><p>Product is zero please contact admin to add some</p></div>
        }
        else{
            //isi table div beneran
            tableDiv = <div></div>
        }
    }
   
    return (
        //<></>
        <div className="py-10 px-10">
            <div className="flex justify-center my-2">
                {welcomeword}
            </div>
            {addProduct}
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
                {allResult.user_products.map((user_product, index)=>(
                    <tr key={user_product.Product.id}>
                        <th>{index + 1}</th>
                        <th>{user_product.Product.title}</th>
                        <th>{user_product.Product.price}</th>
                        <th className="flex">
                            <UpdateProduct {...user_product.Product}/>
                            <DeleteProduct {...user_product.Product} />
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