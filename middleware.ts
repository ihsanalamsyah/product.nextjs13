import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/utils/auth';

export async function middleware(req: NextRequest) {
    console.log("Melewati middleware");
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    const token = authHeader.split(" ")[1];
    const isAuthenticated = await auth(token);
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/api((?!/login|/signIn).*)',
}