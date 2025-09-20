import z from "zod";

// 画像設定
const ALLOWED_IMAGE_TYPE = ["image/jpeg" , "image/png" , "image/jpg"]; // jpeg,png,jpgのみ
const ALLOWED_IMAGE_SIZE = 6 * 1024 * 1024; // 6MBまで

// ベースとなるユーザースキーマ
const baseUserSchema = z.object({
    name : z.string()
        .min(1 , {message : "名前は必須です。"})
        .max(20 , {message :"名前は20文字以内で入力してください。"}),
    email : z.string()
        .min(1 , {message :"メールアドレスは必須です。"})
        .max(32 , {message :"メールアドレスは32文字以内で入力してください。"})
    .email({message :"メールアドレスの形式が正しくありません。"}),
    password : z.string()
        .min(8 , {message :"パスワードは8文字以上にしてください。"})
        .max(20 , {message :"パスワードは20文字以内にしてください"})
        .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {message :"パスワードは数字・英小文字・英大文字をそれぞれ1文字以上使用してください"}),
    icon : z.custom<File>()
        .refine((file) => file.size <= ALLOWED_IMAGE_SIZE , {message :"アイコンは6MB以内にしてください"})
        .refine((file) => ALLOWED_IMAGE_TYPE.includes(file.type) , {message :"アイコンはjpeg,png,jpgのみアップロードできます。"})
        .optional(),
})

// 各エンドポイント用のスキーマ
export const createUserSchema = baseUserSchema.pick({ name : true , email : true , password : true});
export const updateUserSchema = baseUserSchema.pick({ name : true , icon : true});
export const loginUserSchema = baseUserSchema.pick({ email : true , password : true});

// 型生成
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type LoginUserRequest = z.infer<typeof loginUserSchema>;