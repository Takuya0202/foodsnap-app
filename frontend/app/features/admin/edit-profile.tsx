"use client";

import { useToaster } from "@/app/zustand/toaster";
import { UpdateAdminRequest, updateAdminSchema } from "@/schema/admin";
import { client } from "@/utils/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
          setValue("tags", data.tags?.map((arr: { id: number }) => Number(arr.id)) || undefined);
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

  return (
    <div>
      <h1>Edit Profile</h1>
    </div>
  );
}
