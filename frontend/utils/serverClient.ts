import { hc } from "hono/client";
import { AppType } from "../../backend/src";
import { getApiUrl } from "./setting";
import { cookies } from "next/headers";

// サーバーサイドのクライアント
export const serverClient = async () => {
    const cookieStores = await cookies()
    return hc<AppType>(getApiUrl(), {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, {
          ...init,
          credentials: "include",
          headers: {
            ...init?.headers,
            Cookie: cookieStores.toString(),
          },
        });
      },
    });
  }