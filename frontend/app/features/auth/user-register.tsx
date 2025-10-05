"use client";

import { CreateUserRequest, createUserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputText from "../../components/elements/input/input-text";
import FieldError from "../../components/elements/errors/field-error";
import SubmitButton from "../../components/elements/buttons/submit-button";
import { client } from "@/utils/setting";
import { useToaster } from "@/app/zustand/toaster";

type Props = {
  onEmailSent: (email: string) => void;
};

export default function UserRegister({ onEmailSent }: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { open } = useToaster();
  const defaultValues = {
    name: "",
    email: "",
    password: "",
  };

  // init form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(createUserSchema),
  });

  // 非同期で送信
  const onsubmit = async (req: CreateUserRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.user.register.$post({
        json: req,
      });
      if (res.status === 200) {
        reset();
        const { email } = await res.json();
        onEmailSent(email);
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          if (errors.name) setError("name", { message: errors.name });
          if (errors.email) setError("email", { message: errors.email });
          if (errors.password) setError("password", { message: errors.password });
        } else {
          open(data.error || "エラーが発生しました。", "error");
        }
      }
    } catch {
      open("通信に失敗しました。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      className="flex flex-col items-center space-y-4 w-[86%] mx-auto"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="w-full flex flex-col items-start space-y-2">
        <InputText label="ユーザー名" placeholder="ユーザー名" {...register("name")} />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </div>
      <div className="w-full flex flex-col items-start space-y-2">
        <InputText label="メールアドレス" placeholder="メールアドレス" {...register("email")} />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </div>
      <div className="w-full flex flex-col items-start space-y-2">
        <InputText
          label="パスワード"
          placeholder="パスワード"
          type="password"
          {...register("password")}
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </div>
      <div className="my-2">
        <SubmitButton width="240" height="32" text="登録" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
