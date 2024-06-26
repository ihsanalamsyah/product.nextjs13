
type Users = {
    id: number,
    name: string,
    email: string,
    password: string,
    gender: string,
    role: string,
}

type Products = {
    id: number,
    title: string,
    price: number,
}

type MapUserProduct = {
    id: number;
    productID: number;
    userID: number;
    enrollDate: Date;
    Product: Products;
    User: Users;
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
