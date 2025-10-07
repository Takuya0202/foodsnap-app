"use client";

import FieldStatusButton from "@/app/components/elements/buttons/fieldStatus-button";
import FieldError from "@/app/components/elements/errors/field-error";
import InputText from "@/app/components/elements/input/input-text";
import { CreateAdminRequest, createAdminSchema } from "@/schema/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { client } from "@/utils/setting";
import { useToaster } from "@/app/zustand/toaster";
import SelectBox from "@/app/components/elements/input/selectBox";
import MarkAddress from "../mapbox/mark-address";
import TagButton from "@/app/components/elements/buttons/tag-button";
import SubmitButton from "@/app/components/elements/buttons/submit-button";

type Genre = {
  id: number;
  name: string;
};
type Prefecture = {
  id: number;
  name: string;
  area: string;
};
type Tag = {
  id: number;
  name: string;
};
// 管理者登録フォーム
export default function AdminRegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { open } = useToaster();

  // init form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<CreateAdminRequest>({
    mode: "onBlur",
    resolver: zodResolver(createAdminSchema),
  });

  // 県、ジャンル、タグを取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await client.api.store.search.$get();
        if (res.status === 200) {
          const data = await res.json();
          setGenres(data.genres);
          setPrefectures(data.prefectures);
          setTags(data.tags);
        } else {
          open("情報の取得に失敗しました。もう一度ページを読み込んでください。", "error");
        }
      } catch {
        open("情報の取得に失敗しました。もう一度ページを読み込んでください。", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [open]);

  const selectedTags = watch("tags") || [];
  const handleSelectTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setValue(
        "tags",
        selectedTags.filter((tag) => tag !== tagId)
      );
    } else {
      setValue("tags", [...selectedTags, tagId]);
    }
  };

  // フォーム送信
  const onsubmit = async (data: CreateAdminRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.admin.register.$post({
        json: {
          name: data.name,
          email: data.email,
          password: data.password,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          phone: data.phone,
          prefectureId: Number(data.prefectureId),
          genreId: Number(data.genreId),
          tags: data.tags,
          link: data.link,
          startAt: data.startAt,
          endAt: data.endAt,
        },
      });
      if (res.status === 200) {
      } else {
        const data = await res.json();
      }
    } catch {}
  };

  if (isLoading) {
    return <p className="text-white text-[20px]">Loading...</p>;
  }
  return (
    <div className="w-full py-4">
      <form
        className="w-full flex flex-col space-y-10 items-center"
        onSubmit={handleSubmit(onsubmit)}
      >
        {/* メールアドレス */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">メールアドレス</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="foodsnap@example.com" {...register("email")} />
            {errors.email && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.email.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* パスワード */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">パスワード</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="Password" {...register("password")} />
            {errors.password && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.password.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 店舗名 */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">店舗名</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="店舗名" {...register("name")} />
            {errors.name && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.name.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 電話番号 */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">電話番号</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="電話番号" {...register("phone")} />
            {errors.phone && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.phone.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 都道府県 */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">都道府県</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <SelectBox value={prefectures} {...register("prefectureId")} />
            {errors.prefectureId && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.prefectureId.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* address */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">住所</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="東京都千代田区永田町1-7-1" {...register("address")} />
            {errors.address && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.address.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 位置情報 */}
        <div className="w-full flex flex-col space-y-4 ">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">位置情報</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="w-full">
            <MarkAddress setValue={setValue} height="400px" width="100%" />
          </div>
        </div>

        {/* ジャンル */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">ジャンル</p>
            <FieldStatusButton status="opt" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <SelectBox value={genres} {...register("genreId")} />
            {errors.genreId && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.genreId.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* snsリンク */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">SNSリンク</p>
            <FieldStatusButton status="opt" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="https://example.com" {...register("link")} />
            {errors.link && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.link.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 始業時間 */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">始業時間</p>
            <FieldStatusButton status="opt" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="10:00" {...register("startAt")} />
            {errors.startAt && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.startAt.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* 終業時間 */}
        <div className="w-full flex items-center justify-between px-2 space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">終業時間</p>
            <FieldStatusButton status="opt" />
          </div>
          <div className="relative w-[calc(100%-240px)]">
            <InputText placeholder="22:00" {...register("endAt")} />
            {errors.endAt && (
              <div className="absolute top-full left-0 mt-1">
                <FieldError>{errors.endAt.message}</FieldError>
              </div>
            )}
          </div>
        </div>

        {/* タグ */}
        <div className="w-full flex flex-col space-y-4 px-2">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">タグ(複数選択可能)</p>
            <FieldStatusButton status="opt" />
          </div>
          <div className="w-full flex items-center flex-wrap gap-2 mt-3">
            <div className="flex items-center space-x-2 w-full flex-wrap gap-2">
              {selectedTags.map((tagId) => (
                <div key={tagId}>
                  <TagButton
                    name={tags.find((tag) => tag.id === tagId)?.name || ""}
                    isSelected={true}
                    onClick={() => handleSelectTag(tagId)}
                  />
                </div>
              ))}
            </div>
            {tags.map((tag) => {
              if (selectedTags.includes(tag.id)) return null;
              return (
                <div key={tag.id}>
                  <TagButton
                    name={tag.name}
                    isSelected={false}
                    onClick={() => handleSelectTag(tag.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="my-4">
          <SubmitButton text="登録" isSubmitting={isSubmitting} width="360" height="40" />
        </div>
      </form>
    </div>
  );
}
