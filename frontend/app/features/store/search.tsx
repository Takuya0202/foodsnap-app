"use client";
import { client } from "@/utils/setting";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useFilter } from "@/app/zustand/filter";
import GenreButton from "@/app/components/elements/buttons/genre-button";
import { useForm } from "react-hook-form";
import { SearchStoreQueryRequest, searchStoreQuerySchema } from "@/schema/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import CheckBox from "@/app/components/elements/input/checkBox";
import TagButton from "@/app/components/elements/buttons/tag-button";
import SubmitButton from "@/app/components/elements/buttons/submit-button";
// ジャンル、エリア、タグを取得して、検索する
type props = {
  setIsOpen: (isOpen: boolean) => void;
};
export default function Search({ setIsOpen }: props) {
  const [openGenre, setOpenGenre] = useState<boolean>(false);
  const [openArea, setOpenArea] = useState<boolean>(false);
  const [openTag, setOpenTag] = useState<boolean>(false);
  const { genres, prefectures, tags, setGenres, setPrefectures, setTags } = useFilter();
  const [isloading, setIsloading] = useState<boolean>(false);
  const router = useRouter();
  // クエリ取得
  const searchParams = useSearchParams();
  const genreId = searchParams.get("genreId");
  const prefectureIds = searchParams.get("prefectureIds");
  const tagIds = searchParams.get("tagIds");

  const { handleSubmit, watch, setValue } = useForm<SearchStoreQueryRequest>({
    resolver: zodResolver(searchStoreQuerySchema),
    mode: "onChange",
  });

  // クエリからセットされている情報をセット
  useEffect(() => {
    if (genreId) {
      setValue("genreId", Number(genreId));
    }
    if (prefectureIds) {
      setValue("prefectureIds", prefectureIds.split(",").map(Number));
    }
    if (tagIds) {
      setValue("tagIds", tagIds.split(",").map(Number));
    }
  }, [genreId, prefectureIds, tagIds, setValue]);

  // 情報を取得
  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const res = await client.api.store.search.$get();
        if (res.status === 200) {
          const data = await res.json();
          setGenres(data.genres);
          setPrefectures(data.prefectures);
          setTags(data.tags);
        }
      } catch {
      } finally {
        setIsloading(false);
      }
    };
    if (genres.length === 0 && prefectures.length === 0 && tags.length === 0) {
      fetchData();
    }
  }, [genres.length, prefectures.length, tags.length, setGenres, setPrefectures, setTags]);

  // 選択されている情報を監視
  const selectedGenreId = watch("genreId");
  const selectedPrefectureIds = watch("prefectureIds", []) || [];
  const selectedTagIds = watch("tagIds", []) || [];

  const handleGenreClick = (genreId: number) => {
    console.log(selectedGenreId, genreId);
    if (selectedGenreId === genreId) {
      // すでに選択されていたら削除
      setValue("genreId", undefined);
    } else {
      setValue("genreId", genreId);
    }
  };

  const handlePrefectureClick = (prefectureId: number) => {
    if (selectedPrefectureIds.includes(prefectureId)) {
      // すでに選択されていたら削除
      setValue(
        "prefectureIds",
        selectedPrefectureIds.filter((id) => id !== prefectureId)
      );
    } else {
      setValue("prefectureIds", [...selectedPrefectureIds, prefectureId]);
    }
  };

  const handleTagClick = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setValue(
        "tagIds",
        selectedTagIds.filter((id) => id !== tagId)
      );
    } else {
      setValue("tagIds", [...selectedTagIds, tagId]);
    }
  };

  const onsubmit = (data: SearchStoreQueryRequest) => {
    // 選択されたクエリを渡す。
    setIsOpen(false);
    // クエリパラメータを構築
    const params = new URLSearchParams();

    if (data.genreId) {
      params.append("genreId", String(data.genreId));
    }
    if (data.prefectureIds && data.prefectureIds.length > 0) {
      params.append("prefectureIds", data.prefectureIds.join(","));
    }
    if (data.tagIds && data.tagIds.length > 0) {
      params.append("tagIds", data.tagIds.join(","));
    }

    const queryString = params.toString();
    router.push(`/stores/index${queryString ? `?${queryString}` : ""}`);
  };

  // エリアグループ
  const areaGroups = [
    { value: "北海道" },
    { value: "東北" },
    { value: "関東" },
    { value: "東海" },
    { value: "近畿" },
    { value: "中国" },
    { value: "四国" },
    { value: "九州" },
    { value: "沖縄" },
  ];

  // 情報を取得するまで
  if (isloading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white text-base font-bold">情報を取得しています...</p>
      </div>
    );

  return (
    <div className="w-full overflow-y-scroll h-full max-h-[calc(100vh-100px)]">
      <form
        className="w-full flex flex-col space-y-4 flex-1 overflow-y-scroll"
        onSubmit={handleSubmit(onsubmit)}
      >
        {/* ジャンル */}
        <button
          className="w-full border-b-[1px] border-white pb-1 flex items-center"
          type="button"
          onClick={() => setOpenGenre(!openGenre)}
        >
          <KeyboardArrowRight
            sx={{
              color: "white",
              width: "32px",
              height: "32px",
              paddingLeft: "10px",
              transform: openGenre ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <p className="text-white text-base font-bold">ジャンル検索</p>
        </button>

        {openGenre && (
          <div className="w-full flex items-center flex-wrap gap-2 mt-3 overflow-y-scroll h-[400px] ">
            {genres.map((genre) => (
              <div key={genre.id}>
                <GenreButton
                  name={genre.name}
                  isSelected={selectedGenreId === genre.id}
                  handleClick={() => handleGenreClick(genre.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* エリア */}
        <button
          className="w-full border-b-[1px] border-white pb-1 flex items-center"
          type="button"
          onClick={() => setOpenArea(!openArea)}
        >
          <KeyboardArrowRight
            sx={{
              color: "white",
              width: "32px",
              height: "32px",
              paddingLeft: "10px",
              transform: openArea ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <p className="text-white text-base font-bold">
            エリア検索
            {selectedPrefectureIds.length > 0 && (
              <span className="ml-2 text-sm text-[#2ecc71]">
                ({selectedPrefectureIds.length}件選択中)
              </span>
            )}
          </p>
        </button>

        {openArea && (
          <div className="w-full h-[400px] overflow-y-scroll px-4 space-y-4">
            {areaGroups.map((area) => {
              // 一致したエリアを表示する
              const areaPrefectures = prefectures.filter(
                (prefecture) => prefecture.area === area.value
              );
              if (areaPrefectures.length === 0) return null;

              return (
                <div key={area.value} className="space-y-2">
                  <h3 className="text-white font-bold border-b border-white pb-1">{area.value}</h3>
                  <div className="grid grid-cols-2 gap-3 pl-2 text-white">
                    {areaPrefectures.map((prefecture) => (
                      <CheckBox
                        key={prefecture.id}
                        name={prefecture.name}
                        isChecked={selectedPrefectureIds.includes(prefecture.id)}
                        onChange={() => handlePrefectureClick(prefecture.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* タグ */}
        <button
          className="w-full border-b-[1px] border-white pb-1 flex items-center"
          type="button"
          onClick={() => setOpenTag(!openTag)}
        >
          <KeyboardArrowRight
            sx={{
              color: "white",
              width: "32px",
              height: "32px",
              paddingLeft: "10px",
              transform: openTag ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <p className="text-white text-base font-bold">
            タグ検索
            {selectedTagIds.length > 0 && (
              <span className="ml-2 text-sm text-[#3c28c2]">({selectedTagIds.length}件選択中)</span>
            )}
          </p>
        </button>

        {openTag && (
          <div className="w-full flex items-center flex-wrap gap-2 mt-3 overflow-y-scroll h-[300px] ">
            {/* 選択されたタグは先に表示 */}
            {selectedTagIds.map((tagId) => (
              <div key={tagId} className="flex items-center space-x-2 w-full overflow-x-scroll ">
                <TagButton
                  name={tags.find((tag) => tag.id === tagId)?.name || ""}
                  isSelected={true}
                  onClick={() => handleTagClick(tagId)}
                />
              </div>
            ))}
            {/* 選択されていないタグを表示 */}
            {tags.map((tag) => {
              if (selectedTagIds.includes(tag.id)) return null;
              return (
                <div key={tag.id}>
                  <TagButton
                    name={tag.name}
                    isSelected={false}
                    onClick={() => handleTagClick(tag.id)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 検索ボタン */}
        <div className="w-full flex justify-center items-center space-x-4 py-4 flex-shrink-0">
          <button type="button" onClick={() => setIsOpen(false)} className="text-[#3d91ff]">
            キャンセル
          </button>
          <SubmitButton width="112" height="32" text="検索" isSubmitting={false} />
        </div>
      </form>
    </div>
  );
}
