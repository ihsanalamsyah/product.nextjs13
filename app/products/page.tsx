'use server'

import AddProduct from "../components/products/addProduct";
import Logout from "../components/products/logout";
import TableProduct from "../components/products/tableProduct";
import DeleteProduct from "../components/products/deleteProduct";
import EnrollProduct from "../components/products/enrollProduct";
import OpenProduct from "../components/products/openProduct";
import UpdateProduct from "../components/products/updateProduct";
import WelcomeMessage from "../components/products/welcomeMessage";
import { cookies } from 'next/headers'
import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation'
import moment from "moment";


export default async function Products(){
    const route = process.env.NEXT_PUBLIC_ROUTE;
    const getSession = await supabase.auth.getSession();
    if(getSession.data.session == null){
        const response = await fetch(`${route}/logout`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const content = await response.json();
        if(content.status == "OK"){
            redirect('/');
        }
        else{
            alert(content.msg);
            redirect('/products')
        }
    }
    //Method
    async function getUserProduct(token: any, email: any) {
        let userAndProduct: GetUserProduct = {
            user: {
                id: 0,
                name: "",
                email: "",
                gender: "",
                password: "",
                role: "",
            },
            mapUserProducts: []
        };
        
        try {             
            const response = await fetch(`${route}/mapUserProduct`, {
                method: 'POST',
                cache: 'no-store',
                headers:{
                    'Authorization': 'Bearer '+ token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });
            const content = await response.json();
            
            userAndProduct = content;
            
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
        return userAndProduct;
    };
    let isAdmin = false;
    let isProductZero = false;
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const email = cookieStore.get('email');
    const userAndProduct: GetUserProduct = await getUserProduct(token!.value, email!.value);
  
    
    if(userAndProduct.user.role == "Admin"){
        isAdmin = true;
    }
    if(userAndProduct.mapUserProducts.length <= 0){
        isProductZero = true;
    }
    return (
        //<></>
        <div className="py-10 px-10">
            <div className="flex justify-center my-2">
               <WelcomeMessage name={userAndProduct.user.name!} isAdmin={isAdmin} />
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
                    <div className="flex justify-center my-2"><p>Product is empty, please add some</p></div>
                ) : (
                    <div className="flex justify-center my-2"><p>Product is empty, please contact <b>admin</b> to add some </p></div>
                )              
                ) : (
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Action</th>
                            {isAdmin ? (
                                <th>Belongs To</th>
                            ): (
                                <th></th>
                            )}
                            
                        </tr>
                        </thead>
                        <tbody>
                            
                        {userAndProduct.mapUserProducts.map((mapUserProduct, index)=>{
                            const role = userAndProduct.user.role;
                            const today = new Date();
                            const enroll_date = mapUserProduct.enroll_date;            
                            const formattedToday = moment(today);
                            let dateDiff = 99999999;
                            if(mapUserProduct.enroll_date != null){
                                dateDiff = formattedToday.diff(enroll_date, 'days');
                            }
                                                    
                            if(role == "Admin"){
                                return(<tr key={mapUserProduct.product_id!}>
                                    <th>{index + 1}</th>
                                    <th>{mapUserProduct.title!}</th>
                                    <th>{mapUserProduct.price!}</th>
                                    <th className="flex">
                                        <UpdateProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!}/>
                                        <DeleteProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!} />
                                        <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!}/>
                                    </th>
                                    <th>{mapUserProduct.name ?? "None belongs to"}</th>
                                </tr>)
                            }
                            else if (role == "User"){
                                if(dateDiff < 3){
                                    return(<tr key={mapUserProduct.product_id!}>
                                        <th>{index + 1}</th>
                                        <th>{mapUserProduct.title!}</th>
                                        <th>{mapUserProduct.price!}</th>
                                        <th className="flex">
                                            <OpenProduct id={mapUserProduct.product_id!} title={mapUserProduct.title!} price={mapUserProduct.price!}/>
                                        </th>
                                        <th></th>
                                    </tr>)
                                }
                                else{
                                    const product: Products = {
                                        id: mapUserProduct.product_id!,
                                        price: mapUserProduct.price!,
                                        title: mapUserProduct.title!,
                                    }
                                    return(<tr key={mapUserProduct.product_id!}>
                                        <th>{index + 1}</th>
                                        <th>{mapUserProduct.title!}</th>
                                        <th>{mapUserProduct.price!}</th>
                                        <th className="flex">
                                            <EnrollProduct user={userAndProduct.user} product={product}/>
                                        </th>
                                        <th></th>
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