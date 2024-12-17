
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

type GetMapUserProduct = {
    name: string
}

type EnrollProduct = {
    user: Users;
    product: Products;
}

type GetUserProduct = {
    mapUserProducts: MapUserProduct[];
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
type GetImage = {
    image: File,
    product_id: number
}

type ImageComponent = {
    children: any,
    isAdmin: boolean,
    product_id: number
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
    onUpdateTable: any
}
type CheckContentProduct = {
    content_url: string
}
type CheckVideo = {
    video_url: string
}
type DetailProduct = {
    id: number,
    title: string,
    price: number,
    quantity: number,
    description: string
}

type UploadImageProduct = {
    isAdmin: boolean,
    product_id: number
}
type BuyProduct = {
    quantity: number,
    product_id: number,
    email: string
}
type Alert = {
    onClose: any,
    visible: boolean,
    message: string,
    duration?: number
}
type ContentToogle = {
    onToogle: any
}
type ContentToogleSignIn = {
    onToogle: any,
    onToogleResetPassword: any
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
    onUpdateTable: any
}

type TableProduct = {
    users: Users[],
    onUpdateTable: any,
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
    handleChangeProfile: any,
    user_id: number,
    name: string,
    phone: number,
    onUpdateTable: any,
}

type Logout = {
    modalLogout: boolean,
    handleChangeLogout: any
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
type Datasets = {
    label:string,
    data:number[],
    borderWidth: number
}
type MapTitleQtyDatasets = {
    title:string,
    quantity:number[]
}

type Upload={
    file:File
}

type UploadThumbnail={
    product_id: number,
}