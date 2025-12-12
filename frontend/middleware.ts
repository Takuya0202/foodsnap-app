import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 環境判定（プロダクションかどうか）
  const isProduction = process.env.NODE_ENV === "production";

  // supabaseクライアントの作成
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
      },
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, {
              path: "/",
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? isProduction,
              sameSite:
                typeof options?.sameSite === "string"
                  ? options.sameSite
                  : isProduction
                    ? "none"
                    : "lax",
              maxAge: options?.maxAge,
            });
          });
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/stores/top", req.url));
  }
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
  matcher: ["/", "/admin/:path*", "/user/:path*"],
};
