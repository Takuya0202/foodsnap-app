import { Context, Hono } from 'hono';
import { getSupabase } from '../middleware/supabase';
import { supabaseAuthErrorCode } from '../utils/supabaseMessage';
import { AdminReponse } from '../types/adminReponse';
import { serverError , authError } from '../utils/setting';
import { setCookie } from 'hono/cookie';
// OAuthやcallbackなどに関するエンドポイント
export const authApp = new Hono()
  .get('/google', async (c: Context) => {
    try {
      // supabaseクライアントを生成
      const supabase = getSupabase(c);
      const {
        data: { url },
        error,
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${c.env.API_URL}/api/auth/google/callback`,
        },
      });

      // エラー、urlの取得不足
      if (error || !url) {
        throw error;
      }
      return c.redirect(url, 302);
    } catch (error) {
      console.log(error);
      return c.redirect(`${c.env.APP_URL}/auth/error`, 302);
    }
  })
  // OAuthのcallbackで呼び出される。
  .get('/google/callback', async (c: Context) => {
    // 認可コードを取得
    const code = c.req.query('code');
    if (!code) {
      return c.redirect(`${c.env.APP_URL}/auth/error`, 302);
    }

    try {
      const supabase = getSupabase(c);
      // 認可コードをトークンに交換
      const {
        data: { user },
        error: exchangeError,
      } = await supabase.auth.exchangeCodeForSession(code);
      // ユーザー情報の取得失敗
      if (!user || exchangeError) {
        throw exchangeError;
      }
      const { data: isExist, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) {
        throw selectError;
      }

      // 新規ユーザーの場合、profileテーブルにユーザー情報を確立
      if (!isExist) {
        // metadataにroleを追加
        const { data : updateMeta , error : updateMetaError } = await supabase.auth.updateUser({
          data : {
            role : 'user',
          }
        })
        if (updateMetaError) {
          throw updateMetaError;
        }
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
        
        // profileの登録に失敗
        if (!insertData || insertError) {
          throw insertError;
        }
      }
      // topページにリダイレクト
      return c.redirect(`${c.env.APP_URL}/stores/top`, 302);
    } catch (error) {
      console.log(error);
      return c.redirect(`${c.env.APP_URL}/auth/error`, 302);
    }
  })
  // ユーザー登録(email)でcallbackされるページ
  .post('user/callback', async (c: Context) => {
    // フロントからのトークン取得
    const authHeader = c.req.header('authorization');
    const code = authHeader?.replace('Bearer ', '').trim();

    if (!code) {
      console.log('code is null');
      return c.json(authError, 400);
    }
    
    try {
      const supabase = getSupabase(c);
      const {
        data: { user, session },
        error: getUserError,
      } = await supabase.auth.exchangeCodeForSession(code);
      if (!user || getUserError) {
        return c.json(authError, 400);
      }

      // profileテーブルにユーザー情報を確立。アイコンはnull
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: user.user_metadata.name || 'ユーザー名未設定',
          role: 'user',
          icon: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      // 登録に失敗
      if (insertError) {
        return c.json(
          {
            message: 'fail for insert profile',
            error: '登録に失敗しました。',
          },
          400
        );
      }

      // 自前でcookieを保存
      setCookie(c , 'sb-access-token', session.access_token , {
        path : '/',
        httpOnly : true,
        secure : c.env.ENVIRONMENT === 'production',
        sameSite : c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        maxAge : 60 * 60 * 24 * 7, // 7日
      })
      setCookie(c , 'sb-refresh-token', session.refresh_token , {
        path : '/',
        httpOnly : true,
        secure : c.env.ENVIRONMENT === 'production',
        sameSite : c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        maxAge : 60 * 60 * 24 * 7, // 7日
      })

      // 登録成功
      return c.json(
        {
          message: 'success for email auth',
        },
        200
      );
    } catch (error) {
      return c.json(serverError, 500);
    }
  })
  // 管理者のcallback
  .post('/admin/callback', async (c: Context) => {
    const authHeader = c.req.header('authorization');
    const code = authHeader?.replace('Bearer ', '').trim();

    if (!code) {
      return c.json(
        authError,
        401
      );
    }

    try {
      const supabase = getSupabase(c);
      const {
        data: { user, session },
        error: getUserError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (!user || getUserError) {
        return c.json(
          authError,
          401
        );
      }

      try {
        // 管理者情報の登録。rpcを使ってトランザクション
        const { data : admin , error : adminError } = await supabase.rpc('create_admin_with_store' , {
          _user_id : user.id,
          _name : user.user_metadata.name,
          _phone : user.user_metadata.phone,
          _address : user.user_metadata.address,
          _latitude : user.user_metadata.latitude,
          _longitude : user.user_metadata.longitude,
          _start_at : user.user_metadata.start_at || null,
          _end_at : user.user_metadata.end_at || null,
          _prefecture_id : user.user_metadata.prefectureId,
          _genre_id : user.user_metadata.genreId || null,
          _link : user.user_metadata.link || null,
          _photo : user.user_metadata.photo || null,
          _tag_ids : user.user_metadata.tags || [],
        })

        if (adminError) {
          throw adminError;
        }
      } catch (error) {
        return c.json(
          {
            message: 'insert error',
            error: '登録に失敗しました。',
          },
          400
        );
      }

      // 自前でcookieを保存
      setCookie(c , 'sb-access-token', session.access_token , {
        path : '/',
        httpOnly : true,
        secure : c.env.ENVIRONMENT === 'production',
        sameSite : c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        maxAge : 60 * 60 * 24 * 7, // 7日
      })
      setCookie(c , 'sb-refresh-token', session.refresh_token , {
        path : '/',
        httpOnly : true,
        secure : c.env.ENVIRONMENT === 'production',
        sameSite : c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        maxAge : 60 * 60 * 24 * 7, // 7日
      })

      return c.json({
        message: 'success for admin auth',
      }, 200);
    } catch (error) {
      console.log(error);
      return c.json(
        serverError,
        500
      );
    }
  })
  // ログアウト
  .post('/logout', async (c: Context) => {
    try {
      const supabase = getSupabase(c);
      const { error } = await supabase.auth.signOut();
      // ログアウト失敗
      if (error) {
        return c.json(
          {
            message: 'fail for logout',
            error: error.code
              ? supabaseAuthErrorCode[error.code]
              : '予期せぬエラーが発生しました。',
          },
          400
        );
      }
      // ログアウト成功
      return c.json(
        {
          message: 'ログアウトしました。'
        },
        200
      );
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  });
