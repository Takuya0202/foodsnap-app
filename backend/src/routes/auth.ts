import { Context, Hono } from "hono";
import { getSupabase } from "../middleware/supabase";
import { getAppUrl } from "../utils/setting";

export const authApp = new Hono()
  .get('/google', async(c: Context) => {
    try {
        // supabaseクライアントを生成
        const supabase = getSupabase(c);
        const { data: { url }, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getAppUrl(c)}/auth/google/callback`
            }
        })

        // エラー、urlの取得不足
        if (error || !url) {
            return c.json({
                message: 'fail for google auth',
                error: error?.message || 'url not found',
            }, 400)
        }

        return c.json({
            message : 'success for google auth',
            url : url,
        },200);
    } catch (error) {
        return c.json({
            message: 'internal server error',
        }, 500)
    }
  })