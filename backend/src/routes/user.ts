import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { CreateUserRequest, createUserSchema } from "../schema/user";
import { ValidationError } from "../types/errorResponse";
import { getSupabase } from "../middleware/supabase";
import { getAppUrl } from "../utils/setting";
import { SupabaseError } from "../types/errorResponse";
import { SuccessRegisterResponse } from "../types/successResponse";


export const router = new Hono()

// ユーザー新規登録(email&password)
router.post('/register' , zValidator('json' , createUserSchema , async(result , c : Context) => {
    try {
        // バリデーションエラーの場合
        if (!result.success) {
            const errors : Record<string, string> = {}; // エラーはフィールドごとにまとめる
            result.error.issues.forEach((elem) => {
                const field = elem.path[0] as string; // zodErrorのフィールド名は配列で取得されるので0番目を取得
                // フィールドが存在しなかった時に追加
                if (!errors[field]) {
                    errors[field] = elem.message;
                }
            })
            return c.json<ValidationError>({
                message : "validation error",
                errors : errors
            } , 400);
        }
        // 成功時
        const { name , email , password } : CreateUserRequest = result.data;
        // supabaseクライアントの生成
        const supabase = getSupabase(c);
        // ユーザー仮登録
        const { data : { user} , error} = await supabase.auth.signUp({
            email,
            password,
            options : {
                data : {
                    name,
                },
                emailRedirectTo : `${getAppUrl(c)}/user/auth/callback`
            }
        })
        // supabaseエラー
        if (error) {
            return c.json<SupabaseError>({
                message : "supabase error",
                error : error.message
            } , 400);
        }

        // 成功したらemailを返却
        return c.json<SuccessRegisterResponse>({
            message : "register success",
            email : user?.email || null
        })
    } catch (error) {
        return c.json({
            message : "internal server error",
        } , 500);
    }
}))