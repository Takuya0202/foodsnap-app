// バリデーションエラー時に返却するレスポンスの型
export type ValidationError = {
    message : "validation error",
    errors : {
        [field : string] : string
    }
}

// supabaseエラー
export type SupabaseError = {
    message : "supabase error",
    error : string
}

