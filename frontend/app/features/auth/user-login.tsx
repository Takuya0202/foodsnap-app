// email & passwordでのユーザーログイン
"use client";
import { useForm } from "react-hook-form";
import InputText from "../../components/elements/input/input-text";
import SubmitButton from "../../components/elements/buttons/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserRequest, loginUserSchema } from "@/schema/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FieldError from "../../components/elements/errors/field-error";
import { client } from "@/utils/setting";
import { useToaster } from "@/app/zustand/toaster";

export default function UserLogin() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { open } = useToaster();
  const router = useRouter();
  const defaultValues = {
    email: "",
    password: "",
  };

  // formの初期化
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(loginUserSchema),
  });

  // 非同期で送信
  const onsubmit = async (req: LoginUserRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.user.login.$post({
        json: req,
      });
      if (res.status === 200) {
        reset();
        open("ログインしました。", "success");
        window.location.href = "/stores/top"; // routerにするとcookieが反映されてない可能性あるから
      } else {
        const data = await res.json();
        // バリデーションエラーはRPCの型推論が利かないので、unkonwnで型指定
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          if (errors.email) setError("email", { message: errors.email });
          if (errors.password) setError("password", { message: errors.password });
        } else {
          // バリデーション以外のエラーはトースターで表示
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
      className="flex flex-col justify-center items-center space-y-4 w-[86%] mx-auto"
      onSubmit={handleSubmit(onsubmit)}
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
      <div className="my-2">
        <SubmitButton width="240" height="32" text="ログイン" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
