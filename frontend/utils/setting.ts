import { hc } from "hono/client";
import { AppType } from "../../backend/src";

// APIのURLを取得する関数
export function getApiUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_APP_URL!;
  } else {
    return process.env.NEXT_PUBLIC_API_DEV_URL!;
  }
}
// honoクライアントの作成
export const client = hc<AppType>(getApiUrl(), {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Cookieを自動で送信
    });
  },
});
