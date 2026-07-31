import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedRoutes = ["/favourites", "/internal/add-thumbnail", "/history"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Gallery is public, but if logged in, we still want to enforce onboarding
  const isGalleryRoute = request.nextUrl.pathname.startsWith("/gallery");
  const isOnboardingRoute = request.nextUrl.pathname === "/onboarding";

  if (!user) {
    if (isProtectedRoute || isOnboardingRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  } else {
    // User is logged in
    const hasOnboarded = user.user_metadata?.onboarded === true;
    
    // Force onboarding if they are on a protected route OR the gallery
    if (!hasOnboarded && (isProtectedRoute || isGalleryRoute)) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
    
    if (hasOnboarded && isOnboardingRoute) {
      // Already onboarded, don't let them see onboarding page again
      const url = request.nextUrl.clone();
      url.pathname = "/gallery";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
