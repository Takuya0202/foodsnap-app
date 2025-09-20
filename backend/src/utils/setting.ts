import { Context } from "hono"

// 設定に関するファイル。
// 環境変数の型定義
export type Bindings = {
    NODE_ENV : string
    FRONT_APP_URL : string
    FRONT_DEV_URL : string
}
// アプリURLを取得する関数
export const getAppUrl = (c : Context<{ Bindings : Bindings }>) => {
    if (c.env.NODE_ENV === "production") {
        return c.env.FRONT_APP_URL
    }
    return c.env.FRONT_DEV_URL
}

