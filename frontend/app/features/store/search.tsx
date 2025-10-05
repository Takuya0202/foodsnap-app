"use client";
import { client } from "@/utils/setting";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useStores } from "@/app/zustand/store";
import GenreButton from "@/app/components/elements/buttons/genre-button";
// ジャンル、エリア、タグを取得して、検索する
export default function Search() {
  const [openGenre, setOpenGenre] = useState<boolean>(false);
  const [openArea, setOpenArea] = useState<boolean>(false);
  const [openTag, setOpenTag] = useState<boolean>(false);
  const { genres, prefectures, tags, setGenres, setPrefectures, setTags } = useStores();
  const [isloading, setIsloading] = useState<boolean>(false);

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
  if (isloading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>情報を取得しています...</p>
      </div>
    );
  return (
    <div className="w-full">
      {/* ジャンル */}
      <button
        className="w-full border-b-[1px] border-white pb-1 flex items-center"
        onClick={() => setOpenGenre(!openGenre)}
      >
        <KeyboardArrowRight
          sx={{
            color: "white",
            width: "32px",
            height: "32px",
            paddingLeft: "10px",
          }}
        />
        <p className="text-white text-base font-bold">ジャンル検索</p>
      </button>

      {openGenre && (
        <div className="w-full flex items-center gap-2 flex-wrap mt-3 overflow-y-scroll h-[300px] ">
          {genres.map((genre) => (
            <div key={genre.id}>
              <GenreButton name={genre.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
