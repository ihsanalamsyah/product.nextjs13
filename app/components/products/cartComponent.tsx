'use client'

import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { getCookie } from '@/utils/cookies';

const route = process.env.NEXT_PUBLIC_ROUTE;
type Data={
    id: number,
    name: string,
    category: string,
    price: number,
    checkbox: boolean
}

async function DeleteCart(token: string, carts:Cart[], email:string):Promise<boolean>{
    let result:boolean = false;

    try {
        const response = await fetch(`${route}/getAllCart`, {
            method: 'DELETE',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                carts: carts
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            result = true;
        }
    } catch (error) {
        console.error('Error delete data:', error);
    }
    return result;
}
async function GetAllCart(token: string, email: string):Promise<Cart[]> {
    let carts:Cart[] = [];
    try {             
        const response = await fetch(`${route}/getAllCart`, {
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
        if(content.status == "OK"){
            carts = content.data;
        }
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return carts;
};

async function CheckoutProduct(token:string, carts:Cart[], email:string):Promise<boolean>{
    let result:boolean = false;
    try {
        const response = await fetch(`${route}/checkoutProduct`, {
            method: 'POST',
            headers:{
                'Authorization': 'Bearer '+ token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                carts: carts
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            result = true;
        }
    } catch (error) {
        console.error('Error checkout product:', error); 
    }
    return result;
}
export default function CartComponent(){
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [quantities, setQuantities] = useState<number[][]>([]);
    const [mapUserProducts, setMapUserProducts] = useState<MapUserProduct[]>([]);
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
    const [products, setProducts] = useState<any>([]);
    const [checkboxCategory, setCheckboxCategory] = useState<boolean>(true);
    const [checkboxCategoryHP, setCheckboxCategoryHP] = useState<boolean>(true);
    const [checkboxCategoryVid, setCheckboxCategoryVid] = useState<boolean>(true);
    const [checkboxProduct, setCheckboxProduct] = useState<boolean>(true);
    const [checkboxHP, setCheckboxHP] = useState<boolean>(true);
    const [checkboxVid, setCheckboxVid] = useState<boolean>(true);
    useEffect(()=>{    
        const fetchData =  async ()=>{
            const token = getCookie("token");
            const email = getCookie("email");
            let initialCartProducts:CartProduct[] = [];
            let getCarts:Cart[] = [];
            getCarts = await GetAllCart(token!, email!);
            getCarts.every(x=> x.checkbox = true);
            getCarts.forEach(getCart => {
                const findCategory = initialCartProducts.some(x=> x.category ==getCart.products.category!)
                if (!findCategory) {
                    const newCartProduct: CartProduct = {
                        category: getCart.products.category!,
                        carts: getCarts.filter((item) => item.products.category === getCart.products.category!),
                    };
                    initialCartProducts.push(newCartProduct);
                }
            });
            const datas:Data[] = [
                { id: 1, name: "Product 1", category: "Handphone", price:10000, checkbox: true },
                { id: 2, name: "Product 2", category: "Handphone", price:10000, checkbox: true},
                { id: 3, name: "Product 3", category: "Video", price:10000, checkbox: true},
                { id: 4, name: "Product 4", category: "Video", price:10000, checkbox: true},
            ];
           
           
            setCartProducts([]);
        
            // datas.forEach(data => {
            //     const findCategory = updatedCartProducts.some(x=> x.category == data.category)
            //     if (!findCategory) {
            //         const newCartProduct: CartProduct = {
            //             category: data.category,
            //             datas: datas.filter((item) => item.category === data.category),
            //         };
            //         updatedCartProducts.push(newCartProduct);
            //     }
            // });
            setCartProducts(initialCartProducts);
        }
        fetchData();
    }, []);

    function handleMinus (dataID:number){
        let updatedCartProducts = [...cartProducts];
        let cartProduct = updatedCartProducts.filter(x=> x.category == x.carts.find(c=> c.product_id == dataID)?.category)[0];
        const foundCart:Cart = cartProduct.carts.find(c=> c.product_id == dataID) ?? new Cart();
        
        if (foundCart) {
            if (foundCart.quantity != 1) {
                foundCart.quantity =  foundCart.quantity - 1;
                setCartProducts(updatedCartProducts);
            }
        }
    };

    function handlePlus(dataID:number){
        let updatedCartProducts = [...cartProducts];
        let cartProduct = updatedCartProducts.filter(x=> x.category == x.carts.find(c=> c.product_id == dataID)?.category)[0];
        const foundCart:Cart = cartProduct.carts.find(c=> c.product_id == dataID) ?? new Cart();
        
        if (foundCart) {
            foundCart.quantity =  foundCart.quantity + 1;
            setCartProducts(updatedCartProducts);
        }
    };
    function onChangeAll(e: ChangeEvent<HTMLInputElement>){
        const checkbox = e.target;
        if (checkbox.checked) {
            onChangeCategoryHP(e, "Handphone", true)
            onChangeCategoryVid(e, "Video", true)
        }else{
            onChangeCategoryHP(e, "Handphone", false)
            onChangeCategoryVid(e, "Video", false)
        }
    }
    function onChangeCategoryHP(e: ChangeEvent<HTMLInputElement>, category:string, hardcode?:boolean){
       
        let updatedCartProducts = [...cartProducts];
        const checkbox = e.target;
        let checked = checkbox.checked
        if (hardcode != undefined) {
            checked = hardcode
        }
        if (checked) {
            var cartProduct = updatedCartProducts.find(x=> x.category == category);
            if (cartProduct) {
                cartProduct.carts.forEach(data=> data.checkbox = true)
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryHP(true);
        }else{
            var cartProduct = updatedCartProducts.find(x=> x.category == category);
            if (cartProduct) {
                cartProduct.carts.forEach(data=> data.checkbox = false)
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryHP(false);
        }
    }
    function onChangeCategoryVid(e: ChangeEvent<HTMLInputElement>, category:string, hardcode?:boolean){
        let updatedCartProducts = [...cartProducts];
        const checkbox = e.target;
        let checked = checkbox.checked
        if (hardcode != undefined) {
            checked = hardcode
        }
        if (checked) {
            var cartProduct = updatedCartProducts.find(x=> x.category == category);
            if (cartProduct) {
                cartProduct.carts.forEach(data=> data.checkbox = true)
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryVid(true);
        }else{
            var cartProduct = updatedCartProducts.find(x=> x.category == category);
            if (cartProduct) {
                cartProduct.carts.forEach(data=> data.checkbox = false)
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryVid(false);
        }
    }
    function handleModalBuy(){
        setModal(!modal);
    }
    function onChangeProductHP(e: ChangeEvent<HTMLInputElement>, dataID:number){
        let updatedCartProducts = [...cartProducts];
        const checkbox = e.target;
        if (checkbox.checked) {
            var cartProduct = updatedCartProducts.find(x=> x.carts.find(y=> y.product_id == dataID))
            if (cartProduct) {
                var cart = cartProduct.carts.find(x=> x.product_id == dataID);
                if (cart) {
                    cart.checkbox = true
                }
                if (!cartProduct.carts.some(x=> x.checkbox == false)) {
                    onChangeCategoryHP(e, "Handphone", true);
                }
                
            }
            setCartProducts(updatedCartProducts);
        }else{
            var cartProduct = updatedCartProducts.find(x=> x.carts.find(y=> y.product_id == dataID))
            if (cartProduct) {
                var dataz = cartProduct.carts.find(x=> x.product_id == dataID);
                if (dataz) {
                    dataz.checkbox = false
                }
                if (!cartProduct.carts.some(x=> x.checkbox == true)) {
                    onChangeCategoryHP(e, "Handphone", false);
                }
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryHP(false);
        }
    }
    function onChangeProductVid(e: ChangeEvent<HTMLInputElement>, dataID:number){
        let updatedCartProducts = [...cartProducts];
        const checkbox = e.target;
        if (checkbox.checked) {
            var cartProduct = updatedCartProducts.find(x=> x.carts.find(y=> y.product_id == dataID))
            if (cartProduct) {
                var cart = cartProduct.carts.find(x=> x.product_id == dataID);
                if (cart) {
                    cart.checkbox = true
                }
                if (!cartProduct.carts.some(x=> x.checkbox == false)) {
                    onChangeCategoryVid(e, "Video", true);
                }
                
            }
            setCartProducts(updatedCartProducts);
        }else{
            var cartProduct = updatedCartProducts.find(x=> x.carts.find(y=> y.product_id == dataID))
            if (cartProduct) {
                var cart = cartProduct.carts.find(x=> x.product_id == dataID);
                if (cart) {
                    cart.checkbox = false
                }
                if (!cartProduct.carts.some(x=> x.checkbox == true)) {
                    onChangeCategoryVid(e, "Video", false);
                }
            }
            setCartProducts(updatedCartProducts);
            setCheckboxCategoryVid(false);
        }
    }
    async function onDeleteCart(dataID:number){
        const token = getCookie("token")!;
        const email = getCookie("email")!;
        const findCart = cartProducts.flatMap(x=> x.carts.filter(c=> c.cart_id == dataID)) ?? [];
        const result:boolean = await DeleteCart(token, findCart, email);
        if (result) {
            let updatedCartProducts:CartProduct[] = [];
            let getCarts:Cart[] = [];
            getCarts = await GetAllCart(token!, email!);
            getCarts.every(x=> x.checkbox = true);
            getCarts.forEach(getCart => {
                const findCategory = updatedCartProducts.some(x=> x.category == getCart.products.category!)
                if (!findCategory) {
                    const newCartProduct: CartProduct = {
                        category: getCart.products.category!,
                        carts: getCarts.filter((item) => item.products.category === getCart.products.category!),
                    };
                    updatedCartProducts.push(newCartProduct);
                }
            });
            setCartProducts([]);
            
            setCartProducts(updatedCartProducts);
            totalPrice();
        }
        
    }
    async function deleteAllCarts(){

    }
    function totalPrice():string{
        let totalPrice:number = 0;
        cartProducts.forEach(cartProduct =>{
            cartProduct.carts.forEach(cart=>{
                if (cart.checkbox) {
                    let price = cart.quantity * cart.products.price!;
                    totalPrice += price;
                }
                
            })
        });

        let stringPrice:string = totalPrice.toString().replace(/\./g, '');
        stringPrice = "Rp" + stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return stringPrice;
    }
    async function buyProduct(){
        const token = getCookie("token")!;
        const email = getCookie("email")!;
        const filterCarts = cartProducts.flatMap(x=> x.carts.filter(c=> c.checkbox == true)) ?? [];
        const isCheckout = await CheckoutProduct(token, filterCarts, email);
        if (isCheckout) {
            let initialCartProducts:CartProduct[] = [];
            let getCarts:Cart[] = [];
            getCarts = await GetAllCart(token!, email!);
            getCarts.every(x=> x.checkbox = true);
            getCarts.forEach(getCart => {
                const findCategory = initialCartProducts.some(x=> x.category ==getCart.products.category!)
                if (!findCategory) {
                    const newCartProduct: CartProduct = {
                        category: getCart.products.category!,
                        carts: getCarts.filter((item) => item.products.category === getCart.products.category!),
                    };
                    initialCartProducts.push(newCartProduct);
                }
            }); 
            setCartProducts([]);
            setCartProducts(initialCartProducts);
            setModal(!modal);
        }
        
    }
    return (
        <>
         <div className="grid grid-cols-12 gap-4">
            <div className="bg-green-500 h-screen col-start-2 col-end-9">
                <p className="font-bold text-4xl my-4">Keranjang</p>
                <div className="w-100 bg-gray-200 h-auto p-5 rounded-lg">
                    <div className="flex">
                        <div className="mr-4">
                            <input type="checkbox" defaultChecked className="checkbox" onChange={(e) =>onChangeAll(e)} />
                        </div>
                        <div className="flex w-full justify-between">
                            <p className="font-bold text-base">Pilih Semua</p>
                            <p className="font-bold text-gray-400 text-base">Hapus</p>
                        </div>
                    </div>
                    <div className="divider"></div>
                    {cartProducts.map((cartProduct, i)=>(
                        <div key={i} className="my-2">
                            <div className="flex">
                                <div className="mr-4">
                                    {cartProduct.category == "Handphone" ?(
                                        <input type="checkbox" className="checkbox" checked={checkboxCategoryHP} onChange={(e)=> onChangeCategoryHP(e, cartProduct.category)} />
                                    ):(
                                        <input type="checkbox" className="checkbox" checked={checkboxCategoryVid} onChange={(e)=> onChangeCategoryVid(e, cartProduct.category)} />
                                    )}
                                </div>
                                <div className="flex w-full justify-between">
                                    <p className="font-bold text-base">{cartProduct.category}</p>
                                </div>
                            </div>
                            {cartProduct.carts.map((data, j)=>{
                                let stringPrice:string = (data.products.price! * data.quantity).toString().replace(/\./g, '');
                                stringPrice = "Rp" + stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                return(
                                    <div key={data.product_id} className="flex my-2">
                                        <div className="mr-4">
                                            {data.products.category == "Handphone" ? (
                                                <input type="checkbox" className={`checkbox HP-${j}`} checked={data.checkbox} onChange={(e)=> onChangeProductHP(e, data.product_id)} />
                                            ):(
                                                <input type="checkbox" className={`checkbox Vid-${j}`}  checked={data.checkbox} onChange={(e)=> onChangeProductVid(e, data.product_id)} />
                                            )}
                                        </div>
                                        <div className="flex gap-4 w-full">
                                            {data.products.image_url != "" ? (
                                                <Image
                                                    src={data.products.image_url!}
                                                    alt={`Image-${data.products.id}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover rounded-lg"
                                                />
                                            ):(
                                                <Image
                                                    src={"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                                    alt={"Image-default"}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex flex-col justify-between w-full">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className={`text-xs font-bold ${data.products.quantity! <= 10 && data.products.category == "Handphone" ? ``: `hidden`}`}>Stock: {data.products.quantity}</p>
                                                        <p className="text-base">{data.products.title}</p>
                                                    </div>
                                                    
                                                    <p className="font-bold text-base">{stringPrice}</p>
                                                </div>
                                                <div className="flex flex-row-reverse items-center">
                                                    <div className="join">
                                                        <button className="btn btn-sm join-item " onClick={() => handleMinus(data.product_id)} disabled={data.quantity === 1}><p className='text-sm'>-</p></button>
                                                        <button className="btn btn-sm join-item "><p className='text-sm'>{data.quantity}</p></button>
                                                        <button className="btn btn-sm join-item " onClick={() => handlePlus(data.product_id)} disabled={data.quantity === data.products.quantity}><p className='text-sm'>+</p></button>
                                                    </div>
                                                    <DeleteOutlineRoundedIcon  className="text-gray-400 mx-2" onClick={() => onDeleteCart(data.product_id)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}         
                </div>
            </div>
            <div className="bg-blue-800 h-screen col-start-9 col-end-12">
                <p className="font-bold text-4xl my-4 invisible">Keranjang</p>
                <div className="w-100 bg-gray-200 h-auto p-5 rounded-lg">
                    <div className="flex">
                        <div className="flex w-full justify-between">
                            <p className="font-bold text-base">Ringkasan belanja</p>
                        </div>
                    </div>
                    <br></br>
                    <div className="flex">
                        <div className="flex w-full justify-between">     
                            <p className="font-bold text-base">Total</p>
                            <p className="font-bold text-base">{totalPrice()}</p>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex">
                        <button className={`btn btn-success btn-md mx-1 w-full`} onClick={handleModalBuy}>Buy</button>
                    </div>
                </div>
            </div>
            <input type="checkbox" checked={modal} onChange={handleModalBuy} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box rounded-lg p-6 shadow-lg bg-white">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Are you sure want to buy?</h3>
                    <div className="modal-action">
                        <button 
                            type="button"
                            onClick={handleModalBuy}
                            className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Close
                        </button>
                        {!isMutating ? (
                        <button
                            type="button"
                            onClick={buyProduct}
                            className="btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Yes
                        </button>
                        ) : (
                        <button 
                            type="button" 
                            className="btn bg-blue-600 text-white px-4 py-2 rounded-md loading"
                        >
                        </button>
                        )}                 
                    </div>
                </div>
            </div>
         </div>
        </>    
    )
}