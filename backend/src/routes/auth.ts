import { Context, Hono } from "hono";
import { getSupabase } from "../middleware/supabase";
import { getAppUrl , getApiUrl} from "../utils/setting";
import { supabaseAuthErrorCode } from "../utils/supabaseMessage";

export const authApp = new Hono()
  .get('/google', async(c: Context) => {
    try {
        // supabaseクライアントを生成
        const supabase = getSupabase(c);
        const { data: { url }, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getApiUrl(c)}/api/auth/google/callback`
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
  // OAuthのcallbackで呼び出される。
  .get('/google/callback' , async(c : Context) => {
    // 認可コードを取得
    const code = c.req.query('code');
    if (!code) {
        return c.redirect(`${getAppUrl(c)}/auth/error`,302)
    }

    try {
        const supabase = getSupabase(c);
        // 認可コードをトークンに交換
        const { data : { session } , error : exchangeError } = await supabase.auth.exchangeCodeForSession(code);  
        // ユーザー情報の取得失敗
        if (exchangeError) {
            return c.redirect(`${getAppUrl(c)}/auth/error`,302)
        }
        const user = session?.user;
        if (!user) {
            return c.redirect(`${getAppUrl(c)}/auth/error`,302)
        }
        const { data: isExist , error : selectError} = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // 新規ユーザーの場合、profileテーブルにユーザー情報を確立
        if (!isExist) { 
        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
                user_id: user.id, 
                name: user.user_metadata.name || 'ユーザー名未設定',
                role: 'user',
                icon: user.user_metadata.avatar_url ?? null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select();
        
        if (insertError) {
            return c.redirect(`${getAppUrl(c)}/auth/error`,302)
        }
        }

        if (selectError) {
            return c.redirect(`${getAppUrl(c)}/auth/error`,302)
        }
        // topページにリダイレクト
        return c.redirect(`${getAppUrl(c)}/top`,302)
    } catch (error) {
        return c.redirect(`${getAppUrl(c)}/auth/error`,302)
    }
  })
  // ユーザー登録(email)でcallbackされるページ
  .post('user/callback' , async(c : Context) => {
    const { accessToken } = await c.req.json<{ accessToken : string }>();
    if (!accessToken) {
        return c.json({
            message : 'accessToken not found',
            error : '認証に失敗しました。'
        } , 400)
    }
    try {
        const supabase = getSupabase(c);
        const { data : { user } , error : getUserError } = await supabase.auth.getUser(accessToken);
        if (!user || getUserError) {    
            return c.json({
                message : 'fail for get user',
                error : '認証に失敗しました。'
            } , 400)
        }
        // profileテーブルにユーザー情報を確立。アイコンはnull
        const { data : insertData , error : insertError } = await supabase.from('profiles').insert({
            user_id : user.id,
            name : user.user_metadata.name || 'ユーザー名未設定',
            role : 'user',
            icon : null,
            created_at : new Date().toISOString(),
            updated_at : new Date().toISOString(),
        })
        .select();

        // 登録に失敗
        if (insertError) {
            return c.json({
                message : 'fail for insert profile',
                error : '認証に失敗しました。'
            } , 400)
        }

        // 登録成功
        return c.json({
            message : 'success for email auth',
        } , 200)
    }
    catch (error) {
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
                error : error.code ? supabaseAuthErrorCode[error.code] : '予期せぬエラーが発生しました。'
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
  