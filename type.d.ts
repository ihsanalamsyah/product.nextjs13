
type Users = {
    id: number | null,
    name: string | null,
    email: string | null,
    password: string | null,
    gender: string | null,
    role: string | null,
    phone: number | null
}

type Products = {
    id: number | null,
    category: string | null,
    title: string | null,
    price: number | null,
    description: string | null,
    quantity: number | null,
    image_url: string | null,
    video_url: string | null
}

type MapUserProduct = {
    product_id: number | null,
    title: string | null,
    price: number | null,
    quantity: number | null,
    category: string | null,
    description: string | null,
    user_id: number | null,
    enroll_date: Date | null,
    user_id2: number | null,
    name: string | null,
    email: string | null,
    password: string | null,
    gender: string | null,
    role: string | null,
    search: string | null,
    image_url: string | null,
    video_url: string | null,
    sold_out: number | null,
    order_by1: string | null,
    order_by2: string | null,
    order_direction: string | null
}

type EnrollProduct = {
    user: Users;
    product: Products;
}

type WelcomeMessage = {
    isAdmin: boolean,
    name: string,
}

type DynamicResult = {
    status: string | null,
    msg: string | null,
    errorMessage: string | null,
    data: any | null
}

type EditProduct = {
    id: number | null,
    category: string | null,
    title: string | null,
    price: number | null,
    description: string | null,
    quantity: number | null,
    image_url: string | null,
    video_url: string | null,
    onUpdateTable: () => void,
    onProcessing: (isOpen:boolean) => void
}
type CheckContentProduct = {
    content_url: string
}
type DetailProduct = {
    id: number,
    title: string,
    price: number,
    quantity: number,
    description: string
}

type BuyProduct = {
    quantity: number,
    product_id: number,
    email: string,
    cart_id: number,
    carts: Cart[]
}
type Alert = {
    onClose: () => void,
    visible: boolean,
    message: string,
    duration?: number
}
type ContentToogle = {
    onToogle: () => void,
}
type ContentToogleSignIn = {
    onToogle: () => void,
    onToogleResetPassword: () => void
}
type ResetPassword = {
    email: "",
    password: "",
    confirmPassword: ""
}
type ImageProduct = {
    isVisible: boolean,
    image_url: string,
    image_alt: string,
}
type AddProduct = {
    isVisible: boolean,
    onUpdateTable: () => void,
    onProcessing: (isOpen:boolean) => void
}

type TableProduct = {
    users: Users[],
    onUpdateTable: () => void,
    isUpdateTable: boolean
}
type CardProduct = {
    users: Users[]
}
type Navbar = {
    users: Users[]
}

type VideoProduct = {
    isVisible: boolean,
    video_url: string,
    image_url: string
}

type Profile = {
    modalProfile: boolean,
    handleChangeProfile: () => void,
    user_id: number,
    name: string,
    phone: number,
    onUpdateTable: () => void,
    onProcessing: (isOpen:boolean) => void,
}

type Logout = {
    modalLogout: boolean,
    handleChangeLogout: () => Promise<void>
}
type BackToDashboard = {
    category: string
}
type GetHistoryBuyProduct = {
    product_id: number,
    title: string,
    total_quantity: number,
    username: string,
    format_created: string
}
type HistoryBuyProduct = {
    product_id: number,
    title: string,
    total_quantity: number,
    username: string,
    format_created: string,
    start_date:string,
    end_date:string
}
type Datasets = {
    label:string,
    data:number[],
    borderWidth: number
}
type MapTitleQtyDatasets = {
    title:string,
    quantity:number[]
}


type UploadThumbnail={
    product_id: number,
}
type DatePicker = {
    onChangeStartDate: (date: string) => void,
    onChangeEndDate: (date: string) => void
}

type ModalProcess={
    isProcessing:boolean,
    onProcessing: (isOpen:boolean) => void
}

type CheckoutProduct = {
    email: string,
    carts: Cart[]
}

// type CartProduct={
//     category: string,
//     carts: Cart[]
// }
class Cart{
    cart_id:number;
    category: string;
    product_id:number;
    quantity:number;
    checkbox: boolean;
    products:Products;
}

class CartProduct {
    category: string;
    carts: Cart[];
  
    // constructor() {
    //   this.category = "";
    //   this.carts = [];
    // }
  }