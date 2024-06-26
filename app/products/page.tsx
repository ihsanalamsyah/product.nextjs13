
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


const getUserProduct = async (token: string | null | undefined, name: string | null | undefined):Promise<GetUserProduct> => {
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
    const route = process.env.NEXT_PUBLIC_ROUTE;
    try {
               
        const response = await fetch(`${route}/mapUserProduct`, {
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
        
        userAndProduct = content;
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return userAndProduct;
};

export default async function Products(){
    const cookieStore = cookies();
    
    const token = cookieStore.get('token') as any;
    const name = cookieStore.get('name') as any;
    const role = cookieStore.get('role') as any;
    let isAdmin = false;
    let isProductZero = false;
   
    const userAndProduct:GetUserProduct = await getUserProduct(token.value, name.value);
    console.log("userAndProduct", userAndProduct)
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
                            
                        {userAndProduct.mapUserProducts.map((mapUserProduct, index)=>{
                            const role = userAndProduct.user.role;
                            let today = new Date();
                            let enrollDate = mapUserProduct.enrollDate;            
                            let formattedToday = moment(today);
                            let dateDiff = 99999999;
                            if(mapUserProduct.enrollDate != null){
                                dateDiff = formattedToday.diff(enrollDate, 'days');
                            }
                                                    
                            if(role == "Admin"){
                                return(<tr key={mapUserProduct.Product.id}>
                                    <th>{index + 1}</th>
                                    <th>{mapUserProduct.Product.title}</th>
                                    <th>{mapUserProduct.Product.price}</th>
                                    <th className="flex">
                                        <UpdateProduct {...mapUserProduct.Product}/>
                                        <DeleteProduct {...mapUserProduct.Product} />
                                        <OpenProduct {...mapUserProduct.Product}/>
                                    </th>
                                </tr>)
                            }
                            else if (role == "User"){
                                if(dateDiff < 3){
                                    return(<tr key={mapUserProduct.Product.id}>
                                        <th>{index + 1}</th>
                                        <th>{mapUserProduct.Product.title}</th>
                                        <th>{mapUserProduct.Product.price}</th>
                                        <th className="flex">
                                            <OpenProduct {...mapUserProduct.Product}/>
                                        </th>
                                    </tr>)
                                }
                                else{
                                    return(<tr key={mapUserProduct.Product.id}>
                                        <th>{index + 1}</th>
                                        <th>{mapUserProduct.Product.title}</th>
                                        <th>{mapUserProduct.Product.price}</th>
                                        <th className="flex">
                                            <EnrollProduct user={userAndProduct.user} product={mapUserProduct.Product}/>
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