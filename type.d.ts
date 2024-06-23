type ToDo = {
    userId: number,
    id: number,
    title: string,
    completed: boolean
}

type Users = {
    name: string,
    email: string,
    password: string,
    gender: string,
    role: string,
}

type Products = {
    title: string,
    price: number,
}

type MapUserProduct = {
    user_id: number,
    product_id: number,
    enroll_date: Date
}

type GetMapUserProduct = {
    name: string
}