import z, { number } from 'zod';

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

// indexのクエリスキーマ
export const searchStoreQuerySchema = z.object({
  genreId : z.coerce.number().optional(),
  keyword : z.string().optional(),
  // クエリは1,4,5のようになるから配列に変換する
  prefectureIds : z.union([
    z.string().transform(val => val.split(',').map(id => Number(id.trim()))),
    z.array(z.coerce.number())
  ]).optional(),
  tagIds : z.union([
    z.string().transform(val => val.split(',').map(id => Number(id.trim()))),
    z.array(z.coerce.number())
  ]).optional(),
})

export type SearchStoreQueryRequest = z.infer<typeof searchStoreQuerySchema>;

// topのRPCスキーマ
export const getRandomStoresSchema = z.array(
  z.object({
    id : z.string(),
    name : z.string(),
    address : z.string(),
    photo : z.string().nullable(),
    latitude : z.number(),
    longitude : z.number(),
    genre : z.object({
      id : z.number(),
      name : z.string(),
    }),
    posts : z.array(
      z.object({
        id : z.string(),
        name : z.string(),
        price : z.number(),
        photo : z.string(),
        description : z.string().nullable(),
      })
    ),
    likes : z.array(
      z.object({
        user_id : z.string(),
      })
    ),
    comments : z.object({
      count : z.number(),
    }),
    created_at : z.string(),
    updated_at : z.string(),
    is_shown : z.boolean(), // 既に表示されたかどうか
    priority_rank : z.number(), // 優先度
  })
)

export type GetRandomStoresResponse = z.infer<typeof getRandomStoresSchema>;
