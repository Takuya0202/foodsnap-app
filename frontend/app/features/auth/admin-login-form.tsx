"use client";

import SubmitButton from "@/app/components/elements/buttons/submit-button";
import FieldError from "@/app/components/elements/errors/field-error";
import InputText from "@/app/components/elements/input/input-text";
import { useToaster } from "@/app/zustand/toaster";
import { LoginAdminRequest, loginAdminSchema } from "@/schema/admin";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { open } = useToaster();
  const defaultValues: LoginAdminRequest = {
    email: "",
    password: "",
  };
  // init form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginAdminRequest>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(loginAdminSchema),
  });

  // formの送信
  const onsumbit = async (data: LoginAdminRequest) => {
    try {
      setIsSubmitting(true);
      const res = await client.api.admin.login.$post({
        json: data,
      });

      if (res.status === 200) {
        const data = await res.json();
        open(data.message, "success");
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          if (errors.email) {
            setError("email", { message: errors.email });
          }
          if (errors.password) {
            setError("password", { message: errors.password });
          }
        } else {
          open(data.error, "error");
        }
      }
    } catch {
      open("通信に失敗しました。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-[90%] flex justify-center items-center mx-auto">
      <form
        className="flex flex-col items-center space-y-4 justify-center w-full"
        onSubmit={handleSubmit(onsumbit)}
      >
        <div className="w-full flex flex-col items-start space-y-2">
          <InputText
            label="メールアドレス"
            placeholder="foodsnap@example.com"
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>
        <div className="w-full flex flex-col items-start space-y-2">
          <InputText
            label="パスワード"
            placeholder="8文字以上大文字を含む"
            type="password"
            {...register("password")}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </div>
        <div className="my-4">
          <SubmitButton width="240" height="32" text="ログイン" isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
