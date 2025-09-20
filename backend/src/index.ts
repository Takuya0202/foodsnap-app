import { Hono } from 'hono'
import { router } from './routes/user'
import { supabaseMiddleware } from './middleware/supabase'
import { cors } from 'hono/cors'
import { getAppUrl, Bindings } from './utils/setting'




const app = new Hono<{ Bindings : Bindings }>().basePath('/api')
// supabaseのミドルウェア、いつでもクライアントを使用できる
app.use('*' , supabaseMiddleware())
// cors。環境変数は動的に取得するため、asyncでラップする。
app.use('*' , async(c , next) => {
    const corsMiddleware = cors({
        origin : getAppUrl(c),
        allowMethods : ['*'],
        allowHeaders : ['content-type' , 'authorization' , 'Cookie'],
        exposeHeaders : ['*'],
        credentials : true,
        maxAge : 86400,
    })
    return corsMiddleware(c , next);
})


// エンドポイントをグルーピング
app.route('/user' , router)


export default app
export type AppType = typeof app