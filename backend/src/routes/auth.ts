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
                redirectTo: `http://localhost:8787/api/auth/google/callback`
            }
        })

        // エラー、urlの取得不足
        if (error || !url) {
            return c.json({
                message: 'fail for google auth',
                error: error?.message || 'url not found',
            }, 400)
        }
        return c.redirect(url, 302)
    } catch (error) {
        return c.json({
            message: 'internal server error',
        }, 500)
    }
  })
  // OAuthのcallbackで呼び出される。本登録
  .get('/google/callback' , async(c : Context) => {
    // 認可コードを取得
    const code = c.req.query('code');
    const state = c.req.query('state');
    if (!code) {
        return c.json({
            message : 'code not found',
        } , 400)
    }

    try {
        const supabase = getSupabase(c);
        // 認可コードをトークンに交換
        const { data : { session } , error} = await supabase.auth.exchangeCodeForSession(code);  
        // ユーザー情報の取得失敗
        if (error) {
            return c.json({
                message : 'get user failed',
                error : error?.message || 'user not found',
            } , 400)
        }
        const user = session?.user;
        if (!user) {
            return c.json({
                message : 'user not found',
            } , 400)
        }
        const { data: existingUser, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)  // カラム名修正
        .single();

        if (selectError && selectError.code === 'PGRST116') { 
        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,  // カラム名修正
              name: user.user_metadata.name || 'ユーザー名未設定',
              role: 'user',
              icon: user.user_metadata.avatar_url ?? null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select();
          
        if (insertError) {
              return c.json({
                  message: 'create profile failed',
                  error: insertError.message,
              }, 400);
          }
      } else if (selectError) {
          return c.json({
              message: 'check user failed',
              error: selectError.message,
          }, 400);
      }
        // topページにリダイレクト
        return c.redirect(`${getAppUrl(c)}/top`,302)
    } catch (error) {
        return c.json({
            message : 'internal server error',
        } , 500)
    }
  })
  // ログアウト
  .post('/logout' , async(c : Context) => {
    try {
        const supabase = getSupabase(c);
        const { error } = await supabase.auth.signOut();
        // ログアウト失敗
        if (error) {
            return c.json({
                message : 'fail for logout',
                error : error.message,
            }, 400)
        }
        // ログアウト成功
        return c.json({
            message : 'success for logout',
        }, 200)
    }
     catch (error) {
        return c.json({
            message: 'internal server error',
        }, 500)
     }
  })
  