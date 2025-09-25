import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { CreateNewPasswordRequest, createNewPasswordSchema, CreateUserRequest, createUserSchema, LoginUserRequest, loginUserSchema, ResetPasswordRequest, resetPasswordSchema, UpdateUserRequest, updateUserSchema } from "../schema/user";
import { getSupabase } from "../middleware/supabase";
import { getAppUrl, getValidationErrorResponnse } from "../utils/setting";
import { supabaseAuthErrorCode } from "../utils/supabaseMessage";
import { ZodError } from "zod";
import { userDetailResponse } from "../types/userResponse";
import { v4 as uuidv4 } from "uuid";


export const userApp = new Hono()
  .post('/register', zValidator('json', createUserSchema, async(result, c: Context) => {
    try {
        // バリデーションエラーの場合
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError)
            return c.json({
                message: "validation error",
                errors: errors
            }, 400);
        }
        // 成功時
        const { name, email, password }: CreateUserRequest = result.data;
        // supabaseクライアントの生成
        const supabase = getSupabase(c);
        // ユーザー仮登録
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                emailRedirectTo: `${getAppUrl(c)}/user/auth/callback`
            }
        })
        // supabaseエラー
        if (!user || !user.email || error) {
            return c.json({
                message: "supabase error",
                error: error?.code ? supabaseAuthErrorCode[error.code] : '予期せぬエラーが発生しました。'
            }, 400);
        }
        // 成功したらemailを返却
        return c.json({
            message: "register success",
            email: user.email
        })
    } catch (error) {
        return c.json({
            message: "internal server error",
        }, 500);
    }
}))
  .post('/login' , zValidator('json' , loginUserSchema , async(result , c : Context) => {
    try {
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError)
            return c.json({
                message : "validation error",
                errors : errors
            }, 400);
        }

        const { email , password } : LoginUserRequest = result.data;
        const supabase = getSupabase(c);
        const { data : { user } , error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (!user || error) {
            return c.json({
                message : 'fail for login',
                error : 'メールアドレスまたはパスワードが正しくありません。'
            }, 400);
        }

        return c.json({
            message : 'success to login',
        } , 200)
    } catch (error) {
        return c.json({
            message : 'internal server error',
        } , 500)
    }
}))
  // ログインユーザーの情報取得
  .get('/detail' , async(c : Context) => {
    try {
        const supabase = getSupabase(c);
        const { data : { user } , error } = await supabase.auth.getUser();
        // 未認証
        if ( !user || !user.email || error ) {
            return c.json({
                message : 'unAuthorized',
                error : 'ユーザー情報の取得に失敗しました。再度ログインをお試しください。'
            } , 401)
        }
        // ユーザーの情報と、いいねした店舗情報を取得。
        const { data: userDetail, error: userDetailError } = await supabase
            .from('profiles')
            .select(`
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
            `)
            .eq('user_id', user.id)
            .single();

        if (!userDetail || userDetailError) {
            return c.json({
                message: 'fail to get user detail',
                error: 'ユーザー情報の取得に失敗しました。再度お試しください。'
            }, 400);
        }

        // レスポンスを作成
        const res : userDetailResponse = {
            id : userDetail.user_id,
            name : userDetail.name,
            icon : userDetail?.icon,
            likeStores : userDetail.likes.map((like) => ({
                id : like.store.id,
                name : like.store.name,
                address : like.store.address,
                photo : like.store?.photo,
                likeCount : like.store.likes[0]?.count,
                commentCount : like.store.comments[0]?.count,
                posts : like.store.posts.map((post) => ({
                    id : post.id,
                    name : post.name,
                    price : post.price,
                    photo : post?.photo,
                    description : post?.description
                }))
            }))
        }

        return c.json(res, 200);
    } catch (error) {
        return c.json({
            message: 'internal server error',
            error: 'サーバー内部エラーが発生しました。'
        }, 500);
    }
})
  .put('/update' , zValidator('form' , updateUserSchema , async (result , c : Context) => {
    try {
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError)
            return c.json({
                message : "validation error",
                errors : errors
            }, 400);
        }

        const { name , icon } : UpdateUserRequest = result.data;
        const supabase = getSupabase(c);
        const { data : { user } , error : userError } = await supabase.auth.getUser();
        if (!user || userError ) {
            return c.json({
                message : "unAuthorized",
                error : "ユーザー情報の取得に失敗しました。再度ログインをお試しください。"
            }, 401);
        }

        let path = null;
        // アイコンをstorageにupload
        if (icon) {
            try {
                // 拡張子を取得
                const extention = icon.name.split('.').pop();
                // path名を作成。
                const iconUrl = `${uuidv4()}.${extention}`;
                // upload
                const { data : uploadData , error : uploadError } = await supabase
                    .storage
                    .from('icon')
                    .upload(iconUrl , icon , {
                        cacheControl : '3600',
                        upsert : false,
                    })
                // 失敗
                if (uploadError) {
                    throw uploadError;
                }
                // urlを取得
                const { data : { publicUrl } } = supabase.storage.from('icon').getPublicUrl(iconUrl);
                path = publicUrl;
            } catch (error) {
                return c.json({
                    message : 'fail to upload icon',
                    error : 'アイコンのアップロードに失敗しました。再度お試しください。'
                }, 400);
            }
        }

        const { data : updateUser , error : updateUserError } = await supabase
            .from('profiles')
            .update({
                name,
                icon : path,
                updated_at : new Date().toISOString()
            })
            .eq('user_id' , user.id)
            .select();

        if (updateUserError) {
            return c.json({
                message : 'fail to update user',
                error : 'ユーザー情報の更新に失敗しました。再度お試しください。'
            }, 400);
        }
        
        return c.json({
            message : 'success to update user'
        })
    } catch (error) {
        return c.json({
            message : 'internal server error',
        }, 500);
    }
}))
  .delete('/delete' , async(c : Context) => {
    try {
        const supabase = getSupabase(c);
        const { data : { user } , error : userError } = await supabase.auth.getUser();
        if (!user || userError) {
            return c.json({
                message : 'unAuthorized',
                error : 'ユーザー情報の取得に失敗しました。再度ログインをお試しください。'
            }, 401);
        }

        // auth.user.idとprofiles.user_idはリレーション(cascade)なので、自動でprofilesも削除される。
        const { data : deleteUser , error : deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteUserError) {
            return c.json({
                message : 'fail to delete user',
                error : 'ユーザーの削除に失敗しました。再度お試しください。'
            } , 400);
        }

        return c.json({
            message : 'success to delete user',
        } , 200);
    } catch (error) {
        return c.json({
            message : 'internal server error',
        } , 500);
    }
  })
  .post('reset-password' , zValidator('json' , resetPasswordSchema , async(result , c : Context) => {
    try {
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError);
            return c.json({
                message : 'validation error',
                errors : errors
            } , 400);
        }

        const { email } : ResetPasswordRequest = result.data;
        const supabase = getSupabase(c);

        const { data , error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo : `${getAppUrl(c)}/user/reset-password/callback`
        });

        if (error) {
            return c.json({
                message : 'fail to reset password',
                error : 'パスワードのリセットに失敗しました。再度お試しください。'
            } , 400);
        }

        return c.json({
            message : 'success to reset password',
            email : email
        } , 200);
    } catch (error) {
        return c.json({
            message : 'internal server error',
        } , 500);
    }
  }))
  .post('/reset-passwprd/callback' , zValidator('json' , createNewPasswordSchema , async (result , c : Context) => {
    try {
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError);
            return c.json({
                message : 'validation error',
                errors : errors
            } , 400);
        }
        // トークンの取得
        const authHeader = c.req.header('Authorization');
        const accessToken = authHeader?.replace('Bearer' , '');

        if (!accessToken) {
            return c.json({
                message : 'token not found',
                error : '予期せぬエラーが発生しました。'
            } , 400);
        }

        const { password } : CreateNewPasswordRequest = result.data;
        const supabase = getSupabase(c);

        const { data : { user } , error : userError} = await supabase.auth.getUser(accessToken);
        if (userError || !user) {
            return c.json({
                message : 'access token error',
                error : '予期せぬエラーが発生しました。'
            } , 400);
        }
        
        const { error : updateUserError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password : password }
        );

        if (updateUserError) {
            return c.json({
                message : 'fail to update user',
                error : 'パスワードの更新に失敗しました。再度お試しください。'
            } , 400);
        }

        return c.json({
            message : 'パスワードの変更に成功しました。'
        } , 200);
    } catch (error) {
        return c.json({
            message : 'internal server error',
        } , 500);
    }
  }))