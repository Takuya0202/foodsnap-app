"use client";

import { useUser } from "@/app/zustand/user";
import { UpdateUserRequest, updateUserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputText from "../../components/elements/input/input-text";
import FieldError from "../../components/elements/errors/field-error";
import Image from "next/image";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import SubmitButton from "../../components/elements/buttons/submit-button";
import LinkButton from "@/app/components/elements/buttons/link-button";

export default function EditProfile() {
  const [previewwIcon, setPreviewIcon] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { name, icon: iconUrl, setChecked } = useUser();
  const { open } = useToaster();
  const router = useRouter();

  // init form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    setValue("name", name);
    setValue("icon", undefined);
  }, [name, setValue]);

  // ファイル変更時
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewIcon(URL.createObjectURL(file));
      setValue("icon", file);
    }
  };

  const onsubmit = async (req: UpdateUserRequest) => {
    try {
      setIsSubmitting(true);
      const res = await client.api.user.update.$put({
        form: req.icon === undefined ? { name: req.name } : { name: req.name, icon: req.icon }, // iconがundefinedの場合はnameのみ更新
      });

      if (res.status === 200) {
        open("ユーザー情報を更新しました", "success");
        setChecked(); // ユーザー情報を再取得させる
        router.push("/user/profile");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          setError("name", { message: errors.name });
          setError("icon", { message: errors.icon });
        } else {
          open(data.error, "error");
        }
      }
    } catch {
      open("サーバーエラーが発生しました。もう一度お試しください。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col justify-center items-center space-y-4 w-[86%] mx-auto"
      >
        <div>
          <div className="flex justify-center items-center my-4">
            <label htmlFor="icon" className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={previewwIcon || iconUrl || "/default-icon.svg"}
                  alt="ユーザーアイコン"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Add sx={{ color: "white", width: 16, height: 16 }} />
              </div>

              {/* 隠し */}
              <input
                type="file"
                id="icon"
                {...register("icon")}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleIconChange}
              />
            </label>
          </div>
        </div>
        {errors.icon && <FieldError>{errors.icon.message}</FieldError>}
        <InputText placeholder="ユーザー名" {...register("name")} />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}

        <div className="flex items-center space-x-5">
          <LinkButton href="/user/profile">キャンセル</LinkButton>
          <SubmitButton text="更新" width="160" height="40" isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
