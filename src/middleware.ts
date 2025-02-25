import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // console.log("Middleware triggered:", {
  //   path: nextUrl.pathname,
  //   isLoggedIn,
  // }); // Log middleware activity

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    console.log("API auth route, skipping middleware");
    return; // Allow API auth routes to proceed
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // console.log("User is logged in, redirecting to default route");
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // console.log("Auth route, no action needed");
    return; // Allow auth routes to proceed
  }

  if (!isLoggedIn && !isPublicRoute) {
    // console.log("User not logged in, redirecting to login page");
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // console.log("Public route or user logged in, no action needed");
  return; // Allow public routes or authenticated users to proceed
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
