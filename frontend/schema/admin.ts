import z from "zod";

// 画像設定
const ALLOWED_IMAGE_TYPE = ["image/jpeg", "image/png", "image/jpg"]; // jpeg,png,jpgのみ
const ALLOWED_IMAGE_SIZE = 6 * 1024 * 1024; // 6MBまで

const baseAdminSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です。" })
    .max(32, { message: "メールアドレスは32文字以内で入力してください。" })
    .email({ message: "メールアドレスの形式が正しくありません。" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上にしてください。" })
    .max(20, { message: "パスワードは20文字以内にしてください" })
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
      message: "パスワードは数字・英小文字・英大文字をそれぞれ1文字以上使用してください",
    }),
  name: z
    .string()
    .min(1, { message: "店舗名は必須です。" })
    .max(20, { message: "店舗名は20文字以内で入力してください。" }),
  phone: z
    .string()
    .min(10, { message: "電話番号は必須です。" })
    .max(11, { message: "電話番号は11文字以内で入力してください。" })
    .regex(/^[0-9]{10,11}$/, { message: "電話番号は数字のみで入力してください。" }),
  address: z
    .string()
    .min(1, { message: "住所は必須です。" })
    .max(32, { message: "住所は32文字以内で入力してください。" }),
  latitude: z
    .number({ message: "位置情報が入力されていません。" })
    .min(-90, { message: "不正な経度です。" })
    .max(90, { message: "不正な経度です。" }),
  longitude: z
    .number({ message: "位置情報が入力されていません。" })
    .min(-180, { message: "不正な経度です。" })
    .max(180, { message: "不正な経度です。" }),
  link: z
    .union([z.string().url({ message: "正しいURL形式で入力してください。" }), z.literal("")])
    .optional(),
  startAt: z
    .union([
      z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "開始時間はHH:mm形式で入力してください。",
      }),
      z.literal(""),
    ])
    .optional(),
  endAt: z
    .union([
      z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "終了時間はHH:mm形式で入力してください。",
      }),
      z.literal(""),
    ])
    .optional(),
  prefectureId: z.string().min(1, "都道府県を選択してください"), // selectタグを使用する場合、stringになるため、stringにする
  genreId: z.union([z.string().min(1, "ジャンルを選択してください"), z.literal("")]).optional(),
  tags: z.array(z.number()).max(3, { message: "タグは3つまでです。" }).optional(),
  photo: z.union([
    z
      .custom<File>()
      .refine((file) => !file || file.size <= ALLOWED_IMAGE_SIZE, {
        message: "写真は6MB以内にしてください",
      })
      .refine((file) => !file || ALLOWED_IMAGE_TYPE.includes(file.type), {
        message: "写真はjpeg,png,jpgのみアップロードできます。",
      }),
    z.undefined(),
  ]),
});

export const createAdminSchema = baseAdminSchema.omit({ photo: true });
export const updateAdminSchema = baseAdminSchema.omit({ password: true, email: true });
export const loginAdminSchema = baseAdminSchema.pick({ email: true, password: true });

export type CreateAdminRequest = z.infer<typeof createAdminSchema>;
export type UpdateAdminRequest = z.infer<typeof updateAdminSchema>;
export type LoginAdminRequest = z.infer<typeof loginAdminSchema>;
