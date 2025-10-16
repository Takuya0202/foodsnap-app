import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // supabaseクライアントの作成
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;
  // ユーザー情報の取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const role = user?.user_metadata.role;

  // 未認証ユーザー
  if (pathname.startsWith("/user")) {
    // 未認証の場合
    if (!user || error) {
      return NextResponse.redirect(new URL("/auth/user/login", req.url));
    }
  }

  // 管理者ページ roleがadminでない場合にリダイレクト
  if (pathname.startsWith("/admin")) {
    // 未認証または管理者ではない
    if (!user || error || role !== "admin") {
      return NextResponse.redirect(new URL("/auth/admin/login", req.url));
    }
  }
  return res;
}

// 以下ミドルウェアを適用するパス
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
