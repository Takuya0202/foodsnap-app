import { Context } from 'hono';
import { ZodError } from 'zod';
// 設定に関するファイル。
// 環境変数の型定義
export type Bindings = {
  ENVIRONMENT: string;
  APP_URL: string;
  API_URL: string;
};
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
