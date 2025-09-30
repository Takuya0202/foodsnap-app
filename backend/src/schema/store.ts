import z from 'zod';

// コメントのスキーマ
const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'コメント内容は必須です。' })
    .max(400, { message: 'コメント内容は400文字以内にしてください。' })
    .trim() // 前後の空白を除去
    .refine(val => val.replace(/\s/g, '').length > 0, {
      message: '空白のみのコメントは許可されていません。',
    })
    .refine(val => !/https?:\/\//.test(val), { message: 'コメントにURLを含めないでください。' }),
});

export const createCommentSchema = CommentSchema;

// 型生成
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
