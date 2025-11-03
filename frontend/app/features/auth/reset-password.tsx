"use client";

import SubmitButton from "@/app/components/elements/buttons/submit-button";
import FieldError from "@/app/components/elements/errors/field-error";
import InputText from "@/app/components/elements/input/input-text";
import { useToaster } from "@/app/zustand/toaster";
import { ResetPasswordRequest, resetPasswordSchema } from "@/schema/user";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { open } = useToaster();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ResetPasswordRequest>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onsubmit = async (req: ResetPasswordRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.auth["reset-password"].$post({
        json: req,
      });
      if (res.status === 200) {
        open("パスワードリセット用のメールを送信しました。\n メールを確認してください。", "info");
        reset();
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          setError("email", { message: errors.email });
        } else {
          open(data.error, "error");
        }
      }
    } catch {
      open("通信エラーが発生しました。再度お試しください。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="w-[90%] flex flex-col items-center space-y-6"
    >
      <div className="w-full flex flex-col items-start space-y-2">
        <InputText
          label="メールアドレス"
          placeholder="example@example.com"
          {...register("email")}
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </div>
      <div className="flex items-center space-x-4 justify-center">
        <button onClick={() => router.back()} className="text-[#3d91ff] cursor-pointer">
          キャンセル
        </button>
        <SubmitButton width="160" height="32" text="送信" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
