"use client";

import { useUser } from "@/app/zustand/user";
import { UpdateUserRequest, updateUserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputText from "../../atoms/input/input-text";
import FieldError from "../../atoms/errors/field-error";
import Image from "next/image";
import { Add } from "@mui/icons-material";
import { useState } from "react";
export default function UserEdit() {
  const [ previewwIcon , setPreviewIcon ] = useState<string | undefined>(undefined);
  const { name, icon: iconUrl } = useUser();
  // 現状のユーザー情報をセット
  const defaultValues = {
    name,
    icon: undefined,
  };

  // init form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(updateUserSchema),
  });

  const handleIconChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewIcon(URL.createObjectURL(file));
    }
  }

  const onsubmit = async (req : UpdateUserRequest ) => {

  }
  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}
      className="flex flex-col justify-center items-center space-y-4 w-[86%] mx-auto">
        <div>
          <div className="flex justify-center items-center">
            <label htmlFor="icon" className="relative">
              <Image
                src={previewwIcon || iconUrl || "/default-icon.svg"}
                alt="ユーザーのアイコン"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Add sx={{ color: "white", width: 16, height: 16 }} />
              </div>

              {/* 隠し */}
              <input type="file" {...register("icon")} className="hidden" id="icon" onChange={handleIconChange}/>
            </label>
          </div>


        </div>
        {errors.icon && <FieldError>{errors.icon.message}</FieldError>}
        <InputText placeholder="ユーザー名" {...register("name")} />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </form>
    </div>
  );
}
