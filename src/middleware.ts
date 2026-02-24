import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Already authenticated — allow through
        return NextResponse.next();
    },
    {
        callbacks: {
            // authorised = has a valid session token
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Apply to every route EXCEPT login, api/auth, and static files
export const config = {
    matcher: [
        "/((?!login|_next/static|_next/image|favicon.ico|manifest.json|api/auth|api/weather|api/market-prices|icons|images).*)",
    ],
};
