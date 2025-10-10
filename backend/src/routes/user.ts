import { zValidator } from '@hono/zod-validator';
import { Context, Hono } from 'hono';
import {
  CreateNewPasswordRequest,
  createNewPasswordSchema,
  CreateUserRequest,
  createUserSchema,
  LoginUserRequest,
  loginUserSchema,
  ResetPasswordRequest,
  resetPasswordSchema,
  UpdateUserRequest,
  updateUserSchema,
} from '../schema/user';
import { getSupabase } from '../middleware/supabase';
import { getValidationErrorResponnse, uploadImage, Bindings } from '../utils/setting';
import { supabaseAuthErrorCode } from '../utils/supabaseMessage';
import { ZodError } from 'zod';
import { userDetailResponse } from '../types/userResponse';
import { serverError , authError } from '../utils/setting';
import { createServerClient } from '@supabase/ssr';
import { setCookie } from 'hono/cookie';

export const userApp = new Hono<{ Bindings: Bindings }>()
  .post(
    '/register',
    zValidator('json', createUserSchema, (result, c) => {
      // バリデーションエラーの場合
      if (!result.success) {
        const errors = getValidationErrorResponnse(result.error as ZodError);
        return c.json(
          {
            message: 'validation error',
            error: errors,
          },
          400
        );
      }
    }),
    async (c) => {
    try {
      // 成功時
      const { name, email, password }: CreateUserRequest = c.req.valid('json');
      // supabaseクライアントの生成
      const supabase = getSupabase(c);
      // ユーザー仮登録
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${c.env.APP_URL}/auth/user/callback`,
        },
      });
      // supabaseエラー
      if (!user || !user.email || error) {
        console.log(error);
        return c.json(
          {
            message: 'supabase error',
            error: error?.code
              ? supabaseAuthErrorCode[error.code]
              : '予期せぬエラーが発生しました。',
          },
          400
        );
      }
      // 成功したらemailを返却
      return c.json({
        message: 'register success',
        email: user.email,
      } , 200);
    } catch (error) {
    return c.json(
      serverError,
      500
      );
    }
    }
  )
  .post(
    '/login',
    zValidator('json', loginUserSchema, (result, c) => {
      // バリデーションエラーの場合
      if (!result.success) {
        const errors = getValidationErrorResponnse(result.error as ZodError);
        return c.json(
          {
            message: 'validation error',
            error: errors,
          },
          400
        );
      }
    }),
    async (c) => {
      try {
        const { email, password } = c.req.valid('json');
        const supabase = getSupabase(c);
        const {
          data: { user , session},
          error,
        } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!user || error) {
          return c.json(
            {
              message: 'fail for login',
              error: 'メールアドレスまたはパスワードが正しくありません。',
            },
            400
          );
        }

        // なぜかcookieが設定されないので、自身で保存
        setCookie(c , 'sb-access-token' , session.access_token , {
          path : '/',
          httpOnly: true,
          secure: c.env.ENVIRONMENT === 'production',
          sameSite: c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
          maxAge: 60 * 60 * 24 * 7,
        })
        setCookie(c , 'sb-refresh-token' , session.refresh_token , {
          path : '/',
          httpOnly: true,
          secure: c.env.ENVIRONMENT === 'production',
          sameSite: c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
          maxAge: 60 * 60 * 24 * 7,
        })

        return c.json(
          {
            message: 'success to login',
          },
          200
        );
      } catch (error) {
        return c.json(
          serverError,
          500
        );
      }
    }
  )
  // ログインユーザーの情報取得
  .get('/detail', async (c: Context) => {
    try {
      const supabase = getSupabase(c);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      // 未認証
      if (!user || !user.email || error) {
        return c.json(
          authError,
          401
        );
      }
      // ユーザーの情報と、いいねした店舗情報を取得。
      const { data: userDetail, error: userDetailError } = await supabase
        .from('profiles')
        .select(
          `
            name,
            icon,
            user_id,
            likes (
              store : stores (
                  id,
                  name,
                  address,
                  photo,
                  posts (
                      id,
                      name,
                      price,
                      photo,
                      description
                  ),
                  likes (count),
                  comments (count)
              )
            )
            `
        )
        .eq('user_id', user.id)
        .single();

      if (!userDetail || userDetailError) {
        return c.json(
          {
            message: 'fail to get user detail',
            error: 'ユーザー情報の取得に失敗しました。再度お試しください。',
          },
          400
        );
      }

      // レスポンスを作成
      const res: userDetailResponse = {
        id: userDetail.user_id,
        name: userDetail.name,
        icon: userDetail?.icon,
        likeStores: userDetail.likes.map(like => ({
          id: like.store.id,
          name: like.store.name,
          address: like.store.address,
          photo: like.store?.photo,
          likeCount: like.store.likes[0]?.count,
          commentCount: like.store.comments[0]?.count,
          posts: like.store.posts.map(post => ({
            id: post.id,
            name: post.name,
            price: post.price,
            photo: post?.photo,
            description: post?.description,
          })),
        })),
      };

      return c.json(res, 200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }
  })
  .put(
    '/update',
    zValidator('form', updateUserSchema, async (result, c: Context) => {
        if (!result.success) {
          const errors = getValidationErrorResponnse(result.error as ZodError);
          return c.json(
            {
              message: 'validation error',
              errors: errors,
            },
            400
          );
        }
    }),
    async (c) => {
      try {
      const { name, icon }: UpdateUserRequest = c.req.valid('form');
      const supabase = getSupabase(c);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        return c.json(
          authError,
          401
        );
      }
      // 既存データの取得
      const { data : existData , error : existError } = await supabase
        .from('profiles')
        .select('icon')
        .eq('user_id' , user.id)
        .single();
      let path = null;
      // アイコンをstorageにupload
      if (icon) {
        try {
          path = await uploadImage(supabase , user.id , icon , 'icon' , existData?.icon);
        } catch (error) {
          console.log(error);
          return c.json(
            {
              message: 'fail to upload icon',
              error: 'アイコンのアップロードに失敗しました。再度お試しください。',
            },
            400
          );
        }
      }

      // アイコンが変更されなかった場合は既存のアイコン。
      if(!path) {
        path = existData?.icon || null;
      }

      const { data: updateUser, error: updateUserError } = await supabase
        .from('profiles')
        .update({
          name,
          icon: path,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select();

      if (updateUserError) {
        return c.json(
          {
            message: 'fail to update user',
            error: 'ユーザー情報の更新に失敗しました。再度お試しください。',
          },
          400
        );
      }

      return c.json({
        message: 'success to update user',
      },200);
    } catch (error) {
      return c.json(
        serverError,
        500
      );
    }}
  )
  .delete('/delete', async (c: Context) => {
    try {
      const supabase = getSupabase(c);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (!user || userError) {
        return c.json(authError, 401);
      }

      // Service Role Keyでauth.usersから完全削除
      const supabaseAdmin = createServerClient(
        c.env.SUPABASE_URL, 
        c.env.SUPABASE_SERVICE_ROLE_KEY,
        { cookies: { getAll() { return []; }, setAll() {} }}
      );
      
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (deleteUserError) {
        return c.json({
          message: 'fail to delete user',
          error: 'ユーザーの削除に失敗しました。',
        }, 400);
      }

      return c.json({
        message: 'success to delete user',
      }, 200);
    } catch (error) {
      return c.json(serverError, 500);
    }
  })
  .post(
    '/reset-password',
    zValidator('json', resetPasswordSchema, async (result, c: Context) => {
      try {
        if (!result.success) {
          const errors = getValidationErrorResponnse(result.error as ZodError);
          return c.json(
            {
              message: 'validation error',
              errors: errors,
            },
            400
          );
        }

        const { email }: ResetPasswordRequest = result.data;
        const supabase = getSupabase(c);

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${c.env.APP_URL}/user/reset-password/callback`,
        });

        if (error) {
          return c.json(
            {
              message: 'fail to reset password',
              error: 'パスワードのリセットに失敗しました。再度お試しください。',
            },
            400
          );
        }

        return c.json(
          {
            message: 'success to reset password',
            email: email,
          },
          200
        );
      } catch (error) {
        return c.json(
          serverError,
          500
        );
      }
    })
  )
  .post(
    '/reset-passwprd/callback',
    zValidator('json', createNewPasswordSchema, async (result, c: Context) => {
      try {
        if (!result.success) {
          const errors = getValidationErrorResponnse(result.error as ZodError);
          return c.json(
            {
              message: 'validation error',
              errors: errors,
            },
            400
          );
        }
        // トークンの取得
        const authHeader = c.req.header('Authorization');
        const accessToken = authHeader?.replace('Bearer', '');

        if (!accessToken) {
          return c.json(
            {
              message: 'token not found',
              error: '予期せぬエラーが発生しました。',
            },
            400
          );
        }

        const { password }: CreateNewPasswordRequest = result.data;
        const supabase = getSupabase(c);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser(accessToken);
        if (userError || !user) {
          return c.json(
            {
              message: 'access token error',
              error: '予期せぬエラーが発生しました。',
            },
            400
          );
        }

        const { error: updateUserError } = await supabase.auth.admin.updateUserById(user.id, {
          password: password,
        });

        if (updateUserError) {
          return c.json(
            {
              message: 'fail to update user',
              error: 'パスワードの更新に失敗しました。再度お試しください。',
            },
            400
          );
        }

        return c.json(
          {
            message: 'パスワードの変更に成功しました。',
          },
          200
        );
      } catch (error) {
        return c.json(
          serverError,
          500
        );
      }
    })
  );
