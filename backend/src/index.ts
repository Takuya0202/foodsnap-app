import { Hono } from 'hono';
import { userApp } from './routes/user';
import { authApp } from './routes/auth';
import { supabaseMiddleware } from './middleware/supabase';
import { cors } from 'hono/cors';
import { Bindings } from './utils/setting';
import { storeApp } from './routes/store';
import { adminApp } from './routes/admin';

// honoRPCはメソッドチェーンにしないと参照できないので、このような書き方になる
const app = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  // supabaseのミドルウェア、いつでもクライアントを使用できる
  .use('*', supabaseMiddleware())
  // cors。環境変数は動的に取得するため、asyncでラップする。
  .use('*', async (c, next) => {
    const corsMiddleware = cors({
      origin: c.env.APP_URL,
      allowMethods: ['*'],
      allowHeaders: ['content-type', 'authorization', 'Cookie'],
      exposeHeaders: ['*'],
      credentials: true,
      maxAge: 86400,
    });
    return corsMiddleware(c, next);
  })
  // エンドポイントをグルーピング
  .route('/user', userApp)
  .route('/auth', authApp)
  .route('/store', storeApp)
  .route('/admin', adminApp);


export default app;
export type AppType = typeof app;
