
type Users = {
    id: number | null,
    name: string | null,
    email: string | null,
    password: string | null,
    gender: string | null,
    role: string | null,
}

type Products = {
    id: number | null,
    title: string | null,
    price: number | null,
}

type MapUserProduct = {
    product_id: number | null,
    title: string | null,
    price: number | null,
    user_id: number | null,
    enroll_date: Date | null,
    user_id2: number | null,
    name: string | null,
    email: string | null,
    password: string | null,
    gender: string | null,
    role: string | null,
}

type GetMapUserProduct = {
    name: string
}

type EnrollProduct = {
    user: Users;
    product: Products;
}

type GetUserProduct = {
    user: Users;
    mapUserProducts: MapUserProduct[];
}
type WelcomeMessage = {
    name: string,
    isAdmin: boolean
}

type DynamicResult = {
    status: string,
    msg: string,
    errorMessage: string,
    data: any
}