"use client";

import SubmitButton from "@/app/components/elements/buttons/submit-button";
import FieldError from "@/app/components/elements/errors/field-error";
import InputText from "@/app/components/elements/input/input-text";
import { useToaster } from "@/app/zustand/toaster";
import { CreateNewPasswordRequest, createNewPasswordSchema } from "@/schema/user";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type props = {
  code: string;
};
export default function CreateNewPassword({ code }: props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { open } = useToaster();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateNewPasswordRequest>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(createNewPasswordSchema),
    mode: "onBlur",
  });

  const onsubmit = async (req: CreateNewPasswordRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.auth["reset-password"].callback.$post(
        {
          json: req,
        },
        {
          headers: {
            authorization: `Bearer ${code}`,
          },
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        open(data.message, "info");
        reset();
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          setError("password", { message: errors.password });
        } else {
          open(data.error, "error");
        }
      }
    } catch {
      open("通信に失敗しました。再度お試しください。", "error");
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
          label="新しいパスワード"
          placeholder="パスワードを入力してください"
          type="password"
          {...register("password")}
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </div>
      <SubmitButton
        width="240"
        height="32"
        text="新しいパスワードの作成"
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
