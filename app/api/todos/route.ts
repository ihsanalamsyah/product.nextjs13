import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";

export async function GET() {
    const data = await fetch(DATA_SOURCE_URL);

    const todos: ToDo[] = await data.json();
    return NextResponse.json(todos);
}