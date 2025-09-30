import z from "zod";

const ALLOWED_IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_IMAGE_SIZE = 6 * 1024 * 1024;

const basePostSchema = z.object({
  name : z.string().min(1 , { message : 'メニュー名は必須です。' })
    .max(20 , { message : 'メニュー名は20文字以内にしてください。' }),
  price : z.number({message : 'メニューの価格は数値で入力してください。'}).min(1 , { message : 'メニューの価格は必須です。' }),
  photo : z.custom<File>()
    .refine(file => file.size > 0 , { message : 'メニューの写真は必須です。' })
    .refine(file => file.size <= ALLOWED_IMAGE_SIZE , { message : 'メニューの写真は6MB以内にしてください。' })
    .refine(file => ALLOWED_IMAGE_TYPE.includes(file.type) , { message : 'メニューの写真はjpeg,png,jpgのみアップロードできます。' }),
  description : z.string().max(100 , { message : 'メニューの説明は100文字以内にしてください。' }).optional(),
});

export const createAndUpdatePostSchema = basePostSchema;

export type CreateAndUpdatePostRequest = z.infer<typeof createAndUpdatePostSchema>;