// email & passwordでのユーザーログイン
"use client";
import { useForm } from "react-hook-form";
import InputText from "../../atoms/input/input-text";
import SubmitButton from "../../atoms/buttons/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserRequest, loginUserSchema } from "@/schema/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FieldError from "../../atoms/errors/field-error";
import { client } from "@/utils/setting";
import ErrorToaster from "../../atoms/toaster/error-toaster";

export default function UserLogin() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toasterOpen, setToasterOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const defaultValues = {
    email: "",
    password: "",
  };

  // formの初期化
  const { register,
    handleSubmit,
    reset,
    formState : { errors },
    setError,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver : zodResolver(loginUserSchema)
  });

  // 非同期で送信
  const onsubmit = async (req : LoginUserRequest) => {
    setIsSubmitting(true);
    setToasterOpen(false);
    try {
      const res = await client.api.user.login.$post({
        json : req,
      });
      if (res.status === 200) {
        reset();
        router.push('/top');
      }
      else {
        const data = await res.json();
        // バリデーションエラーはRPCの型推論が利かないので、unkonwnで型指定
        if (data.message === 'validation error') {
          const errors = data.error as unknown as Record<string, string>;
          if (errors.email) setError('email', { message: errors.email });
          if (errors.password) setError('password', { message: errors.password });
        }
        else {
          // バリデーション以外のエラーはトースターで表示
          setErrorMessage(data.error || "エラーが発生しました。");
          setToasterOpen(true);
        }
      }
    } catch {
      setErrorMessage("通信に失敗しました。");
      setToasterOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <ErrorToaster 
        text={errorMessage} 
        open={toasterOpen} 
        onClose={() => setToasterOpen(false)} 
      />
      <form className="flex flex-col justify-center items-center space-y-4 w-[86%] mx-auto" onSubmit={handleSubmit(onsubmit)}>
        <InputText label="メールアドレス" placeholder="foodsnap@example.com" {...register('email')} />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
        <InputText label="パスワード" placeholder="8文字以上大文字を含む" type="password" {...register('password')} />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
        <SubmitButton width="240" height="32" text="ログイン" isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
