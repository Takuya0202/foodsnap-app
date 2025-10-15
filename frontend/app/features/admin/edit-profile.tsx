"use client";

import { useToaster } from "@/app/zustand/toaster";
import { UpdateAdminRequest, updateAdminSchema } from "@/schema/admin";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FieldStatusButton from "@/app/components/elements/buttons/fieldStatus-button";
import InputText from "@/app/components/elements/input/input-text";
import FieldError from "@/app/components/elements/errors/field-error";
import SelectBox from "@/app/components/elements/input/selectBox";
import MarkAddress from "../mapbox/mark-address";
import TagButton from "@/app/components/elements/buttons/tag-button";
import SubmitButton from "@/app/components/elements/buttons/submit-button";
import Image from "next/image";
import { Add } from "@mui/icons-material";
import LinkButton from "@/app/components/elements/buttons/link-button";

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
export default function EditProfile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { open } = useToaster();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
  } = useForm<UpdateAdminRequest>({
    mode: "onBlur",
    resolver: zodResolver(updateAdminSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 管理者情報の取得
        const adminRes = await client.api.admin.detail.$get();
        if (adminRes.status === 200) {
          const data = await adminRes.json();
          setValue("name", data.name);
          setValue("address", data.address);
          setValue("phone", data.phone);
          setValue("latitude", data.latitude);
          setValue("longitude", data.longitude);
          setValue("link", data.link || undefined);
          setValue("startAt", data.startAt || undefined);
          setValue("endAt", data.endAt || undefined);
          setValue("prefectureId", String(data.prefectureId));
          setValue("genreId", data.genreId !== null ? String(data.genreId) : undefined);
          setValue("tags", data.tags?.map((arr: { id: number }) => arr.id) || undefined);
          setPreviewPhoto(data.photo || null);
        } else {
          const data = await adminRes.json();
          open(data.message, "error");
          router.push("/admin/dashboard");
        }

        // ジャンル、エリア、タグの取得
        const dataRes = await client.api.store.search.$get();
        if (dataRes.status === 200) {
          const data = await dataRes.json();
          setGenres(data.genres);
          setPrefectures(data.prefectures);
          setTags(data.tags);
        } else {
          const data = await dataRes.json();
          open(data.message, "error");
          router.push("/admin/dashboard");
        }
      } catch {
        open("通信に失敗しました。もう一度お試しください。", "error");
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [open, router, setValue, setGenres, setPrefectures, setTags]);

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

  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
      setValue("photo", file, { shouldValidate: true });
    } else {
      // ファイルが選択されなかった場合
      setValue("photo", undefined, { shouldValidate: false });
      setPreviewPhoto(null);
    }
  };

  const onsubmit = async (req: UpdateAdminRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.admin.update.$put({
        // formDataなのでstringで送るようにする。
        form: {
          name: req.name,
          address: req.address,
          phone: req.phone,
          latitude: String(req.latitude),
          longitude: String(req.longitude),
          prefectureId: req.prefectureId,
          genreId: req.genreId ? req.genreId : undefined,
          tags: req.tags?.map((tag) => String(tag)),
          ...(req.link !== undefined && req.link?.trim() !== "" ? { link: req.link } : {}),
          ...(req.startAt !== undefined && req.startAt?.trim() !== ""
            ? { startAt: req.startAt }
            : {}),
          ...(req.endAt !== undefined && req.endAt?.trim() !== "" ? { endAt: req.endAt } : {}),
          ...(req.photo !== undefined ? { photo: req.photo } : {}),
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        reset();
        open(data.message, "success");
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          if (errors.name) setError("name", { message: errors.name });
          if (errors.address) setError("address", { message: errors.address });
          if (errors.phone) setError("phone", { message: errors.phone });
          if (errors.latitude) setError("latitude", { message: errors.latitude });
          if (errors.longitude) setError("longitude", { message: errors.longitude });
          if (errors.prefectureId) setError("prefectureId", { message: errors.prefectureId });
          if (errors.genreId) setError("genreId", { message: errors.genreId });
          if (errors.tags) setError("tags", { message: errors.tags });
          if (errors.link) setError("link", { message: errors.link });
          if (errors.startAt) setError("startAt", { message: errors.startAt });
          if (errors.endAt) setError("endAt", { message: errors.endAt });
          if (errors.photo) setError("photo", { message: errors.photo });
        } else {
          open(data.error, "error");
        }
      }
    } catch {
      open("通信に失敗しました。もう一度お試しください。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-white text-[20px]">Loading...</p>;
  }
  return (
    <form
      className="w-full flex flex-col space-y-14 items-center"
      onSubmit={handleSubmit(onsubmit)}
    >
      {/* 店舗写真 */}
      <div className="w-full flex flex-col space-y-4 items-center px-2 ">
        <div className="w-full flex justify-start items-center space-x-4">
          <div className="flex items-center space-x-2 w-[240px] justify-between">
            <p className="text-white text-[20px]">店舗写真</p>
            <FieldStatusButton status="opt" />
          </div>
          <div>{errors.photo && <FieldError>{errors.photo.message}</FieldError>}</div>
        </div>
        <div>
          <label htmlFor="photo" className="relative">
            <div className="w-[360px] h-[240px] overflow-hidden">
              <Image
                src={previewPhoto || "/default-menu.svg"}
                alt="店舗写真"
                width={360}
                height={240}
                className="w-full h-full object-cover bg-[#2a2a2a]"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Add sx={{ color: "white", width: 32, height: 32 }} />
            </div>

            <input
              type="file"
              id="photo"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleChangePhoto}
            />
          </label>
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
        <div className="flex items-center space-x-4">
          <div className="w-[240px] flex items-center space-x-2 justify-between">
            <p className="text-white text-[20px]">位置情報</p>
            <FieldStatusButton status="req" />
          </div>
          <div className="flex items-center space-x-2">
            {errors.latitude && <FieldError>{errors.latitude.message}</FieldError>}
            {!errors.latitude && errors.longitude && (
              <FieldError>{errors.longitude.message}</FieldError>
            )}
          </div>
        </div>
        <div className="w-full">
          <MarkAddress
            setValue={setValue}
            height="400px"
            width="100%"
            oldLat={watch("latitude")}
            oldLng={watch("longitude")}
          />
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
        <div className="flex items-center space-x-2">
          <div className="w-[240px] flex items-center space-x-2 justify-between">
            <p className="text-white text-[20px]">タグ(複数選択可能)</p>
            <FieldStatusButton status="opt" />
          </div>
          {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
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

      <div className="my-4 flex items-center space-x-10">
        <LinkButton href="/admin/dashboard">キャンセル</LinkButton>
        <SubmitButton text="更新" isSubmitting={isSubmitting} width="360" height="40" />
      </div>
    </form>
  );
}
