import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnBudget = req.nextUrl.pathname.startsWith('/budget')

  // Allow access to auth-related routes
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (isOnDashboard || isOnBudget) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  if (isLoggedIn && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}) 