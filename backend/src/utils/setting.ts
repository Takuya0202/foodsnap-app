import { Context } from "hono"

// 設定に関するファイル。honoではprocess.env経由で環境変数を取得できないため。
export type Bindings = {
    NODE_ENV : string
    FRONT_APP_URL : string
    FRONT_DEV_URL : string
}

export const getAppUrl = (c : Context<{ Bindings : Bindings }>) => {
    if (c.env.NODE_ENV === "production") {
        return c.env.FRONT_APP_URL
    }
    return c.env.FRONT_DEV_URL
}