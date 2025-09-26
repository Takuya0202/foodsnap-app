import z from 'zod';

// 画像設定
const ALLOWED_IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/jpg']; // jpeg,png,jpgのみ
const ALLOWED_IMAGE_SIZE = 6 * 1024 * 1024; // 6MBまで

const baseAdminSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスは必須です。' })
    .max(32, { message: 'メールアドレスは32文字以内で入力してください。' })
    .email({ message: 'メールアドレスの形式が正しくありません。' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上にしてください。' })
    .max(20, { message: 'パスワードは20文字以内にしてください' })
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
      message: 'パスワードは数字・英小文字・英大文字をそれぞれ1文字以上使用してください',
    }),
  name: z
    .string()
    .min(1, { message: '店舗名は必須です。' })
    .max(20, { message: '店舗名は20文字以内で入力してください。' }),
  phone: z
    .string()
    .min(10, { message: '電話番号は必須です。' })
    .max(11, { message: '電話番号は11文字以内で入力してください。' })
    .regex(/^[0-9]{10,11}$/, { message: '電話番号は数字のみで入力してください。' }),
  address: z
    .string()
    .min(1, { message: '住所は必須で。' })
    .max(32, { message: '住所は32文字以内で入力してください。' }),
  latitude: z
    .number()
    .min(-90, { message: '不正な経度です。' })
    .max(90, { message: '不正な経度です。' }),
  longitude: z
    .number()
    .min(-180, { message: '不正な経度です。' })
    .max(180, { message: '不正な経度です。' }),
  link: z.string().url({ message: '正しいURL形式で入力してください。' }).optional(),
  startAt: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: '開始時間はHH:mm形式で入力してください。',
    })
    .optional(),
  endAt: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: '終了時間はHH:mm形式で入力してください。',
    })
    .optional(),
  prefectureId: z.string().min(1, { message: '都道府県は必須です。' }),
  genreId: z.string().optional(),
  tags: z.array(z.string()).max(3, { message: 'タグは3つまでです。' }).optional(),
  photo: z
    .custom<File>()
    .refine(file => file.size <= ALLOWED_IMAGE_SIZE, { message: '写真は6MB以内にしてください' })
    .refine(file => ALLOWED_IMAGE_TYPE.includes(file.type), {
      message: '写真はjpeg,png,jpgのみアップロードできます。',
    })
    .optional(),
});

export const createAdminSchema = baseAdminSchema;
export const updateAdminSchema = baseAdminSchema.omit({ password: true, email: true });

export type CreateAdminRequest = z.infer<typeof createAdminSchema>;
export type UpdateAdminRequest = z.infer<typeof updateAdminSchema>;
