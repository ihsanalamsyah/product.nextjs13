
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
    productID: number | null,
    title: string | null,
    price: number | null,
    userID: number | null,
    enrollDate: Date | null,
    userID2: number | null,
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
