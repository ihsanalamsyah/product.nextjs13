'use client'

import { getCookie } from '../../../utils/cookies';
import moment from 'moment';
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import EnrollProduct from "./enrollProduct";
import OpenProduct from "./openProduct";


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


const getUserProduct = async (token: string | null | undefined, name: string | null | undefined) => {

    const route = process.env.NEXT_PUBLIC_ROUTE;
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

export default async function TableProduct({children } : any){
    // const token = getCookie("token");
    // const name = getCookie("name");
    // let allResult: GetUserProduct = {
    //     user: {
    //         id: 0,
    //         name: "",
    //         email: "",
    //         gender: "",
    //         password: "",
    //         role: "",
    //     },
    //     user_products: []
    // };
    // if(allResult.user_products.length <= 0){
    //     allResult = await getUserProduct(token, name);
    // }
    
    // let isAdmin = false;
    // let isProductZero = false;
    // if(allResult.user.role == "Admin"){
    //     isAdmin = true;
    // }
   
    // if(allResult.user_products.length <= 0){
    //     isProductZero = true;
    // }
  
    return (
        <>
        <div>{children}</div>
        </>

        // <div>
        //     {isProductZero ? (
        //     isAdmin ? (
        //         <div className="flex justify-center my-2"><p>Product is zero, but why not add some ?</p></div>
        //     ) : (
        //         <div className="flex justify-center my-2"><p>Product is zero, please contact <b>admin</b> to add some </p></div>
        //     )              
        //     ) : (
        //         <table className="table w-full">
        //             <thead>
        //             <tr>
        //                 <th>#</th>
        //                 <th>Product Name</th>
        //                 <th>Price</th>
        //                 <th>Action</th>
        //             </tr>
        //             </thead>
        //             <tbody>
                        
        //             {allResult.user_products.map((user_product, index)=>{
        //                 const role = allResult.user.role;
        //                 let today = new Date();
        //                 let enrollDate = user_product.enroll_date;            
        //                 let formattedToday = moment(today);
        //                 let dateDiff = 99999999;
        //                 if(user_product.enroll_date != null){
        //                     dateDiff = formattedToday.diff(enrollDate, 'days');
        //                 }
                                                
        //                 if(role == "Admin"){
        //                     return(<tr key={user_product.Product.id}>
        //                         <th>{index + 1}</th>
        //                         <th>{user_product.Product.title}</th>
        //                         <th>{user_product.Product.price}</th>
        //                         <th className="flex">
        //                             <UpdateProduct {...user_product.Product}/>
        //                             <DeleteProduct {...user_product.Product} />
        //                             <OpenProduct {...user_product.Product}/>
        //                         </th>
        //                     </tr>)
        //                 }
        //                 else if (role == "User"){
        //                     if(dateDiff < 3){
        //                         return(<tr key={user_product.Product.id}>
        //                             <th>{index + 1}</th>
        //                             <th>{user_product.Product.title}</th>
        //                             <th>{user_product.Product.price}</th>
        //                             <th className="flex">
        //                                 <OpenProduct {...user_product.Product}/>
        //                             </th>
        //                         </tr>)
        //                     }
        //                     else{
        //                         return(<tr key={user_product.Product.id}>
        //                             <th>{index + 1}</th>
        //                             <th>{user_product.Product.title}</th>
        //                             <th>{user_product.Product.price}</th>
        //                             <th className="flex">
        //                                 <EnrollProduct user={allResult.user} product={user_product.Product}/>
        //                             </th>
        //                         </tr>)
        //                     }
        //                 }
        //             })}
        //             </tbody>
        //         </table>
        //     )}
           
        // </div>
    )
}