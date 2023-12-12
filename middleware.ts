import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isAdminPath = path === '/admin' || path === '/admin/:path*'
  const isPublicPath = path === '/auth' || path === '/auth/forget-password'

  const token = await getToken({ req: request, secret: secret });

  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.nextUrl))
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL('/login', request.nextUrl))
  // }

}

export const config = {
  matcher: [
    '/',
    '/admin',
    '/admin/:path*',
    '/auth',
    '/auth/forget-password'
  ]
}