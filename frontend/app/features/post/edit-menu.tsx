"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { UpdatePostRequest } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePostSchema } from "@/schema/post";
import { client } from "@/utils/setting";
import { useToaster } from "@/app/zustand/toaster";
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';
import FieldStatusButton from "@/app/components/elements/buttons/fieldStatus-button";
import FieldError from "@/app/components/elements/errors/field-error";
import Image from "next/image";
import { Add } from "@mui/icons-material";
import InputText from "@/app/components/elements/input/input-text";
import SubmitButton from "@/app/components/elements/buttons/submit-button";
import LinkButton from "@/app/components/elements/buttons/link-button";


export default function EditMenu() {
  const params = useParams();
  const id = params.id;
  const { open } = useToaster();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<UpdatePostRequest>({
    mode: "onBlur",
    resolver: zodResolver(updatePostSchema),
  });

  // セットされている投稿を取得
  useEffect(() => {
    if (!id || typeof id !== "string") {
      router.push("/admin/dashboard");
      return;
    }
    const getPost = async () => {
      setIsLoading(true);
      try {
        const res = await client.api.post[":postId"].$get({ param: { postId: id } });
        if (res.status === 200) {
          const data = await res.json();
          setValue("name", data.name);
          setValue("price", data.price.toString());
          setPreviewPhoto(data.photo);
          setValue("photo", undefined);
          setValue("description", data.description || "");
        } else {
          const data = await res.json();
          open(data.error, "error");
          router.push("/admin/dashboard");
        }
      } catch {
        open("サーバーエラーが発生しました。もう一度お試しください。", "error");
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  } , [id , router , open ,setValue]);

  // 写真変更
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
      setValue("photo", file);
    }
  };

  // フォーム送信
  const onsubmit = async (req : UpdatePostRequest) => {
    setIsSubmitting(true);
    try {
      if (!id || typeof id !== "string") return;
      const res = await client.api.post[":postId"].update.$put({
        param : { postId : id }, // paransは配列で受け取るので
        form : req.photo !== undefined ? req : {
          name : req.name,
          price : req.price,
          description : req.description,
        }
      });
      if (res.status === 200) {
        open("投稿を更新しました。", "success");
        reset();
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          setError("name", { message: errors.name });
          setError("price", { message: errors.price });
          setError("photo", { message: errors.photo });
          setError("description", { message: errors.description });
        } else {
          open(data.error, "error");
          router.push("/admin/dashboard");
        }
      }
    } catch {
      open("サーバーエラーが発生しました。もう一度お試しください。", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress 
          size={40}
          color="primary"
          className="animate-spin"
        />
      </div>
    )
  }
  return (
    <form className="flex flex-col space-y-10 w-full mx-4" onSubmit={handleSubmit(onsubmit)}>
      {/* メニュー者品 */}
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-6">
          <p className="text-white text-[20px] font">料理写真</p>
          <FieldStatusButton status="opt" />
          {errors.photo && <FieldError>{errors.photo.message}</FieldError>}
        </div>
        <div className="flex justify-center items-center">
          <label htmlFor="photo" className="relative">
            <div className="w-[360px] h-[240px] overflow-hidden">
              <Image
                src={previewPhoto || "/default-menu.svg"}
                alt="料理写真"
                width={360}
                height={240}
                className="object-cover w-full h-full bg-[#2a2a2a] "
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Add sx={{ color: "white", width: 32, height: 32 }} />
            </div>

            <input
              type="file"
              id="photo"
              {...register("photo")}
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
      </div>

      {/* メニュー名 */}
      <div className="flex items-center justify-between px-2 space-x-4 w-full">
        <div className="w-[120px] flex items-center justify-between">
          <p className="text-white text-[20px] font">料理名</p>
          <FieldStatusButton status="req" />
        </div>
        <div className="w-[calc(100%-120px)] relative">
          <InputText placeholder="メニュー名" {...register("name")} />
          {errors.name && (
            <div className="absolute top-full left-0 mt-1">
              <FieldError>{errors.name.message}</FieldError>
            </div>
          )}
        </div>
      </div>

      {/* 価格 */}
      <div className="flex items-center justify-between px-2 space-x-4 w-full">
        <div className="w-[120px] flex items-center justify-between">
          <p className="text-white text-[20px] font">価格</p>
          <FieldStatusButton status="req" />
        </div>
        <div className="w-[calc(100%-120px)] relative">
          <InputText placeholder="価格(数値で入力)" {...register("price")} type="number" />
          {errors.price && (
            <div className="absolute top-full left-0 mt-1">
              <FieldError>{errors.price.message}</FieldError>
            </div>
          )}
        </div>
      </div>

      {/* 説明 */}
      <div className="flex items-center justify-between px-2 space-x-4 w-full">
        <div className="w-[120px] flex items-center justify-between">
          <p className="text-white text-[20px] font">説明</p>
          <FieldStatusButton status="opt" />
        </div>
        <div className="w-[calc(100%-120px)] relative">
          <InputText placeholder="説明" {...register("description")} />
          {errors.description && (
            <div className="absolute top-full left-0 mt-1">
              <FieldError>{errors.description.message}</FieldError>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center my-4 items-center space-x-10">
        <LinkButton href="/admin/dashboard">キャンセル</LinkButton>
        <SubmitButton width="260" height="40" text="投稿する" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
