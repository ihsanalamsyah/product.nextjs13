import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers'
import { NextApiHandler } from 'next';

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    console.log(session);
    if(!session){
        return NextResponse.rewrite( new URL("/", req.url))
    }
    return res;
};

export function auth(req: NextRequest, res: NextResponse) {
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    const JWT_SECRET = process.env.JWT_SECRET!;
    if(authHeader){

        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, function(err, verifiedJwt){
            if(err){
                return NextResponse.json({ status: "error", msg: "Invalid token" }, { status: 403 });        
            }
            console.log("verifiedJwt", verifiedJwt);
            return NextResponse.next();
        })
    }
    else{
        return NextResponse.json({ status: "error", msg: "Invalid or Expired token" }, { status: 401 });
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}


export function useMiddleware(handler:NextApiHandler, middleware:auth){

}
