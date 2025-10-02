import { SupabaseClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { Database } from '../types/supabase';
import { v4 as uuidv4 } from 'uuid';
// 設定に関するファイル。ヘルパー関数など
// 環境変数の型定義
export type Bindings = {
  ENVIRONMENT: string;
  APP_URL: string;
  API_URL: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

// サーバーエラーとauthエラーのレスポンス
export const serverError = {
  message : 'internal server error',
  error : 'サーバーエラーが発生しました。',
}
export const authError = {
  message : 'unAuthorized',
  error : '認証に失敗しました。再度ログインをお試しください。',
}
// バリデーションエラーのレスポンスするフィールドを返却する関数
export const getValidationErrorResponnse = (ze: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {}; // エラーはフィールドごとにまとめる
  ze.issues.forEach(elem => {
    const field = elem.path[0] as string; // zodErrorのフィールド名は配列で取得されるので0番目を取得
    // フィールドが存在しなかった時に追加
    if (!errors[field]) {
      errors[field] = elem.message;
    }
  });

  return errors;
};
// storageに画像をuploadする関数。成功時はバケットパスを返却する。
export async function uploadImage(
  supabase :SupabaseClient<Database>,
  file : File,
  backet : string,
  existUrl : string | null = null ) : Promise<string> {
  try {
    // update
    if (existUrl && existUrl.includes('supabase')){
      // バケットパスを取得
      const bucketPath = existUrl.split('/').pop(); // これはバケットパスがネストされていないことを想定。uuid.拡張子
      if (!bucketPath) {
        throw new Error('画像の更新に失敗しました。');
      }
      const { data , error } = await supabase.storage.from(backet).update(
          bucketPath , file , {
          cacheControl : '3600',
          upsert : true,
        }
      )
      if (error) {
        throw error;
      }
      return existUrl;
    }
    // 新しくuploadするためのバケットパス生成
    const extension = file.name.split('.').pop();
    const bucketPath = `${uuidv4()}.${extension}`;
    // upload
    const { data , error } = await supabase.storage.from(backet).upload(
      bucketPath , file , {
        cacheControl : '3600',
        upsert : false,
      }
    )
    if (error) {
      throw error;
    }
    // publicUrlを返却
    const { data : { publicUrl } } = supabase.storage.from(backet).getPublicUrl(bucketPath);
    return publicUrl;
  } catch (error) {
    throw error;
  }
}