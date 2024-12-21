import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Initialize Supabase client using @supabase/ssr
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, {
              ...cookie.options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to login page
  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/entrar";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/criar-pedido", "/meus-pedidos"],
};
