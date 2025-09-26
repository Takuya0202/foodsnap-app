import { Context, Hono } from 'hono';
import { getSupabase } from '../middleware/supabase';
import { getAppUrl, getApiUrl } from '../utils/setting';
import { supabaseAuthErrorCode } from '../utils/supabaseMessage';
import cuid from 'cuid';
import { AdminReponse } from '../types/adminReponse';

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
          redirectTo: `${getApiUrl(c)}/api/auth/google/callback`,
        },
      });

      // エラー、urlの取得不足
      if (error || !url) {
        return c.json(
          {
            message: 'fail for google auth',
            error: error?.message || 'url not found',
          },
          400
        );
      }
      return c.redirect(url, 302);
    } catch (error) {
      return c.json(
        {
          message: 'internal server error',
        },
        500
      );
    }
  })
  // OAuthのcallbackで呼び出される。
  .get('/google/callback', async (c: Context) => {
    // 認可コードを取得
    const code = c.req.query('code');
    if (!code) {
      return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
    }

    try {
      const supabase = getSupabase(c);
      // 認可コードをトークンに交換
      const {
        data: { session },
        error: exchangeError,
      } = await supabase.auth.exchangeCodeForSession(code);
      // ユーザー情報の取得失敗
      if (exchangeError) {
        return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
      }
      const user = session?.user;
      if (!user) {
        return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
      }
      const { data: isExist, error: selectError } = await supabase
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
          return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
        }
      }

      if (selectError) {
        return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
      }
      // topページにリダイレクト
      return c.redirect(`${getAppUrl(c)}/top`, 302);
    } catch (error) {
      return c.redirect(`${getAppUrl(c)}/auth/error`, 302);
    }
  })
  // ユーザー登録(email)でcallbackされるページ
  .post('user/callback', async (c: Context) => {
    // フロントからのトークン取得
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer', '');

    if (!accessToken) {
      return c.json(
        {
          message: 'accessToken not found',
          error: '認証に失敗しました。',
        },
        400
      );
    }
    try {
      const supabase = getSupabase(c);
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser(accessToken);
      if (!user || getUserError) {
        return c.json(
          {
            message: 'fail for get user',
            error: '認証に失敗しました。',
          },
          400
        );
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
            error: '認証に失敗しました。',
          },
          400
        );
      }

      // 登録成功
      return c.json(
        {
          message: 'success for email auth',
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          message: 'internal server error',
        },
        500
      );
    }
  })
  // 管理者のcallback
  .post('/admin/callback', async (c: Context) => {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer', '');

    if (!accessToken) {
      return c.json(
        {
          message: 'accessToken not found',
          error: '認証に失敗しました。',
        },
        400
      );
    }

    try {
      const supabase = getSupabase(c);
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser(accessToken);

      if (!user || getUserError) {
        return c.json(
          {
            message: 'fail for get user',
            error: '認証に失敗しました。',
          },
          400
        );
      }

      try {
        // 管理者情報の登録。profileとstore,tagsのトランザクションを行う
        // profileの作成
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: user.user_metadata.name,
            role: 'admin',
            icon: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (!profileData || profileError) {
          throw profileError;
        }
        // storeの作成
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .insert({
            id: cuid(),
            user_id: user.id,
            name: user.user_metadata.name,
            phone: user.user_metadata.phone,
            address: user.user_metadata.address,
            latitude: user.user_metadata.latitude,
            longitude: user.user_metadata.longitude,
            prefecture_id: user.user_metadata.prefectureId,
            genre_id: user.user_metadata?.genreId,
            start_at: user.user_metadata?.startAt,
            end_at: user.user_metadata?.endAt,
            link: user.user_metadata?.link,
            photo: user.user_metadata?.photo,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!storeData || storeError) {
          supabase.from('profiles').delete().eq('user_id', user.id);
          throw storeError;
        }

        // tagsの作成
        if (user.user_metadata?.tags && user.user_metadata?.tags.length > 0) {
          const { data: tagsData, error: tagsError } = await supabase
            .from('store_tags')
            .insert(
              user.user_metadata?.tags.map((tag: string) => ({
                store_id: storeData.id,
                tag_id: tag,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
            )
            .select();

          if (!tagsData || tagsError) {
            supabase.from('profiles').delete().eq('user_id', user.id);
            supabase.from('stores').delete().eq('id', storeData.id);
            throw tagsError;
          }
        }
      } catch (error) {
        console.log(error);
        return c.json(
          {
            message: 'insert error',
            error: '登録に失敗しました。',
          },
          400
        );
      }
      // 登録成功
      const { data: selectData, error: selectError } = await supabase
        .from('stores')
        .select(
          `
          id,
          name,
          likes (count),
          posts (
            id,
            name,
            price,
            photo,
            description,
            updated_at
          ),
          comments (
            count,
            id,
            content,
            user_id,
            profiles!user_id (
              name,
              icon
            ),
            created_at
          )
        `
        )
        .eq('user_id', user.id)
        .single();

      if (!selectData || selectError) {
        return c.json(
          {
            message: 'fail for select store',
            error: '管理者情報の取得に失敗しました。もう一度ログインしてください。',
          },
          400
        );
      }

      const res: AdminReponse = {
        id: selectData.id,
        name: selectData.name,
        likeCount: selectData.likes[0]?.count,
        commentCount: selectData.comments[0]?.count,
        posts:
          selectData.posts.map(post => ({
            id: post.id,
            name: post.name,
            price: post.price,
            photo: post.photo,
            description: post?.description,
            updatedAt: post.updated_at,
          })) || null,
        comments:
          selectData.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            userId: comment.user_id,
            userName: comment.profiles.name,
            userIcon: comment.profiles?.icon,
            createdAt: comment.created_at,
          })) || null,
      };

      return c.json(res, 200);
    } catch (error) {
      console.log(error);
      return c.json(
        {
          message: 'internal server error',
        },
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
          message: 'success for logout',
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          message: 'internal server error',
        },
        500
      );
    }
  });
