import z from "zod";

const ALLOWED_IMAGE_TYPE = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_IMAGE_SIZE = 6 * 1024 * 1024;

const basePostSchema = z.object({
  name: z
    .string()
    .min(1, { message: "メニュー名は必須です。" })
    .max(20, { message: "メニュー名は20文字以内にしてください。" }),
  price: z.string().min(1, { message: "メニューの価格は必須です。" }),
  description: z
    .string()
    .max(100, { message: "メニューの説明は100文字以内にしてください。" })
    .optional(),
});

// 作成用（写真必須）
export const createPostSchema = basePostSchema.extend({
  photo: z
    .custom<File>()
    .refine((file) => file.size > 0, { message: "メニューの写真は必須です。" })
    .refine((file) => file.size <= ALLOWED_IMAGE_SIZE, {
      message: "メニューの写真は6MB以内にしてください。",
    })
    .refine((file) => ALLOWED_IMAGE_TYPE.includes(file.type), {
      message: "メニューの写真はjpeg,png,jpgのみアップロードできます。",
    }),
});

// 更新用（写真はオプショナル）
export const updatePostSchema = basePostSchema.extend({
  photo: z
    .custom<File>()
    .refine((file) => !file || file.size === 0 || file.size <= ALLOWED_IMAGE_SIZE, {
      message: "メニューの写真は6MB以内にしてください。",
    })
    .refine((file) => !file || file.size === 0 || ALLOWED_IMAGE_TYPE.includes(file.type), {
      message: "メニューの写真はjpeg,png,jpgのみアップロードできます。",
    })
    .optional(),
});

export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;
