
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
    quantity: number | null
}

type MapUserProduct = {
    product_id: number | null,
    title: string | null,
    price: number | null,
    quantity: number | null,
    category: string | null,
    user_id: number | null,
    enroll_date: Date | null,
    user_id2: number | null,
    name: string | null,
    email: string | null,
    password: string | null,
    gender: string | null,
    role: string | null,
    search: string | null
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
    name: string,
    isAdmin: boolean
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

type CheckImage = {
    image_url: string
}
type CheckVideo = {
    video_url: string
}
type DetailProductPhone = {
    id: number,
    title: string,
    price: number,
    quantity: number
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
    message: string
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
    isVisible: boolean
}

type TableProduct = {
    users: Users[]
}

type Navbar = {
    users: Users[]
}

type VideoProduct = {
    isVisible: boolean,
    video_url: string
}

type Profile = {
    modalProfile: boolean,
    handleChangeProfile: any,
    user_id: number,
    name: string,
    phone: number,
}

type Logout = {
    modalLogout: boolean,
    handleChangeLogout: any
}

type BackToDashboard = {
    category: string
}