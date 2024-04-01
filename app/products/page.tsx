
import AddProduct from "../components/products/addProduct";
import Logout from "../components/products/logout";
import TableProduct from "../components/products/tableProduct";
import { getCookie } from '../../utils/cookies';
import DeleteProduct from "../components/products/deleteProduct";
import EnrollProduct from "../components/products/enrollProduct";
import OpenProduct from "../components/products/openProduct";
import UpdateProduct from "../components/products/updateProduct";
import WelcomeMessage from "../components/products/welcomeMessage";
import moment from "moment";
import { cookies } from 'next/headers';
import { ReactNode } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    password: string;
    role: string;
}

interface Product {
    id: number;
    title: string;
    price: number;
}
interface GetUser {
    data: User;
    msg: string;
    status: string;
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

const getUserProduct = async (token: string | null | undefined, name: string | null | undefined):Promise<GetUserProduct> => {
    let allResult: GetUserProduct = {
        user: {
            id: 0,
            name: "",
            email: "",
            gender: "",
            password: "",
            role: "",
        },
        user_products: []
    };
    const route = process.env.NEXT_PUBLIC_ROUTE;
    try {
               
        const response = await fetch(`${route}/getusergetproducts`, {
            method: 'POST',
            cache: 'no-store',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        });
        const content = await response.json();
        
        allResult = content;

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return allResult;
};

export default async function Products(){
    const cookieStore = cookies();
    
    const token = cookieStore.get('token') as any;
    const name = cookieStore.get('name') as any;
    const role = cookieStore.get('role') as any;
    let isAdmin = false;
    let isProductZero = false;
   
    let allResult:GetUserProduct = await getUserProduct(token.value, name.value);
 
   
    if(allResult.user.role == "Admin"){
        isAdmin = true;
    }
   
    if(allResult.user_products.length <= 0){
        isProductZero = true;
    }
    return (
        //<></>
        <div className="py-10 px-10">
            <div className="flex justify-center my-2">
               <WelcomeMessage name={name.value} isAdmin={isAdmin} />
            </div>
            <div className="py-2 flex">
                {isAdmin ? (
                    <AddProduct />
                ) : (
                    <div></div>
                )}
            </div>

            <hr></hr>
            
            <TableProduct>
                <div>
                {isProductZero ? (
                isAdmin ? (
                    <div className="flex justify-center my-2"><p>Product is zero, but why not add some ?</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is zero, please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            
                        {allResult.user_products.map((user_product, index)=>{
                            const role = allResult.user.role;
                            let today = new Date();
                            let enrollDate = user_product.enroll_date;            
                            let formattedToday = moment(today);
                            let dateDiff = 99999999;
                            if(user_product.enroll_date != null){
                                dateDiff = formattedToday.diff(enrollDate, 'days');
                            }
                                                    
                            if(role == "Admin"){
                                return(<tr key={user_product.Product.id}>
                                    <th>{index + 1}</th>
                                    <th>{user_product.Product.title}</th>
                                    <th>{user_product.Product.price}</th>
                                    <th className="flex">
                                        <UpdateProduct {...user_product.Product}/>
                                        <DeleteProduct {...user_product.Product} />
                                        <OpenProduct {...user_product.Product}/>
                                    </th>
                                </tr>)
                            }
                            else if (role == "User"){
                                if(dateDiff < 3){
                                    return(<tr key={user_product.Product.id}>
                                        <th>{index + 1}</th>
                                        <th>{user_product.Product.title}</th>
                                        <th>{user_product.Product.price}</th>
                                        <th className="flex">
                                            <OpenProduct {...user_product.Product}/>
                                        </th>
                                    </tr>)
                                }
                                else{
                                    return(<tr key={user_product.Product.id}>
                                        <th>{index + 1}</th>
                                        <th>{user_product.Product.title}</th>
                                        <th>{user_product.Product.price}</th>
                                        <th className="flex">
                                            <EnrollProduct user={allResult.user} product={user_product.Product}/>
                                        </th>
                                    </tr>)
                                }
                            }
                        })}
                        </tbody>
                    </table>
                )}
                
                </div>
            </TableProduct>
              
            <div className="py-2 flex flex-row-reverse">         
                <Logout />
            </div>
        </div>
    )

    
}