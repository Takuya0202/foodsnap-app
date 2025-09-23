import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { CreateUserRequest, createUserSchema, LoginUserRequest, loginUserSchema } from "../schema/user";
import { ValidationError } from "../types/errorResponse";
import { getSupabase } from "../middleware/supabase";
import { getAppUrl, getValidationErrorResponnse } from "../utils/setting";
import { SupabaseError } from "../types/errorResponse";
import { SuccessRegisterResponse } from "../types/successResponse";
import { supabaseAuthErrorCode } from "../utils/supabaseMessage";
import { ZodError } from "zod";


export const userApp = new Hono()
  .post('/register', zValidator('json', createUserSchema, async(result, c: Context) => {
    try {
        // バリデーションエラーの場合
        if (!result.success) {
            const errors = getValidationErrorResponnse(result.error as ZodError)
            return c.json<ValidationError>({
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
            return c.json<SupabaseError>({
                message: "supabase error",
                error: error?.code ? supabaseAuthErrorCode[error.code] : '予期せぬエラーが発生しました。'
            }, 400);
        }
        // 成功したらemailを返却
        return c.json<SuccessRegisterResponse>({
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
            })
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
        const supabase =getSupabase(c);
        const { data : { user } , error } = await supabase.auth.getUser();
        if ( !user || error ) {
            return c.json({
                message : 'unAuthorized',
                error : 'ユーザー情報の取得に失敗しました。再度ログインをお試しください。'
            })
        }
    }
    catch (error) {
        
    } 
  })
