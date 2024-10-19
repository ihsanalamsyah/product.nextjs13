import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/utils/auth';

export async function middleware(req: NextRequest) {
   
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        console.log("Authorisasi kosong");
        return NextResponse.redirect(new URL('/', req.url));
    }
    const token = authHeader.split(" ")[1];
    const isAuthenticated = await auth(token);
    if (!isAuthenticated) {
        console.log("Tidak ter-auntentikasi");
        return NextResponse.redirect(new URL('/', req.url));
    }
    console.log("Berhasil ter-auntentikasi");
    return NextResponse.next();
}

export const config = {
    matcher: '/api((?!/login|/signUp|/resetPassword).*)',
}