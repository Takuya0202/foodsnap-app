"use client";

import { useToaster } from "@/app/zustand/toaster";
import { CreateNewPasswordRequest, createNewPasswordSchema } from "@/schema/user";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type props = {
  code : string;
}
export default function CreateNewPassword({ code }: props) {
  const [isSubmitting , setIsSubmitting ] = useState<boolean>(false);
  const { open } = useToaster();
  const router = useRouter();
  const {
    register, 
    handleSubmit,
    formState : { errors },
    reset,
    setError
  } = useForm<CreateNewPasswordRequest>({
    defaultValues : {
      password : '',
    },
    resolver : zodResolver(createNewPasswordSchema),
    mode : 'onBlur'
  });

  const onsubmit = async (req : CreateNewPasswordRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.auth["reset-password"].callback.$post({
        json : req
      },{
        headers : {
          'authorization' : `Bearer ${code}`
        }
      });
      
    } catch{
      open('通信に失敗しました。再度お試しください。' , 'error');
    }
    finally {
        setIsSubmitting(false);
    }
  }
  return (
    <div>
      <h1>新しいパスワードの作成</h1>
    </div>
  );
}