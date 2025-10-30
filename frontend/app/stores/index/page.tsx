import BelongFeature from "@/app/components/elements/stores/belongFeature";
import StoreCard from "@/app/components/elements/stores/storeCard";
import { serverClient } from "@/utils/serverClient";
import { Suspense } from "react";
import StoreModal from "@/app/components/layouts/modal/storeModal";
type props = {
  searchParams: Promise<{
    genreId: string | string[] | undefined;
    prefectureIds: string | string[] | undefined;
    tagIds: string | string[] | undefined;
    keyword: string | string[] | undefined;
  }>;
};
function StoresIndexSkeleton() {
  return (
    <div>
      <h1>StoresIndexSkeleton</h1>
    </div>
  );
}

async function StoresIndexContent({ searchParams }: props) {
  // クエリの取得
  const { genreId, prefectureIds, tagIds, keyword } = await searchParams;

  const fetchData = async () => {
    try {
      const client = await serverClient();
      const res = await client.api.store.list.$get({
        query: {
          genreId: genreId,
          prefectureIds: prefectureIds,
          tagIds: tagIds,
          keyword: keyword,
        },
      });
      console.log(res);
      if (res.status === 200) {
        const data = await res.json();
        return data;
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    }
  };

  // ジャンルやタグ、都道府県の情報を取得
  const fetchInfo = async () => {
    try {
      const client = await serverClient();
      const res = await client.api.store.search.$get();
      if (res.status === 200) {
        const data = await res.json();
        return data;
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    }
  };
  const data = await fetchData();
  const info = await fetchInfo();
  // クエリはカンマ区切りでカンマ区切りで取得されるので、splitしてして配列に変換。
  const arrayPrefectureIds =
    prefectureIds && !Array.isArray(prefectureIds) && prefectureIds.split(",").map(Number);
  const arrayTagIds = tagIds && !Array.isArray(tagIds) && tagIds.split(",").map(Number);

  console.log(data);
  return (
    <>
      <div
        className="w-full h-full max-w-[480px] mx-auto
      flex flex-col items-start space-y-4 p-4 overflow-y-scroll"
      >
        {/* 検索クエリを表示 */}
        <div className="w-full flex flex-col space-y-3.5">
          <p className="text-white font-semibold">{keyword && `${keyword}の検索結果`}</p>
          {/* ジャンル、都道府県、タグを表示 */}
          <div className="w-full flex items-center space-x-2 overflow-x-auto">
            {genreId && (
              <BelongFeature className="whitespace-nowrap shrink-0">
                {info.genres.find((genre) => genre.id === Number(genreId))?.name}
              </BelongFeature>
            )}
            {arrayPrefectureIds &&
              arrayPrefectureIds.map((prefectureId) => (
                <BelongFeature key={prefectureId} className="whitespace-nowrap shrink-0">
                  {info.prefectures.find((prefecture) => prefecture.id === prefectureId)?.name}
                </BelongFeature>
              ))}
            {arrayTagIds &&
              arrayTagIds.map((tagId) => (
                <BelongFeature key={tagId} className="whitespace-nowrap shrink-0">
                  {info.tags.find((tag) => tag.id === tagId)?.name}
                </BelongFeature>
              ))}
          </div>
        </div>
        {/* 店舗情報を表示 */}
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white font-semibold">店舗が見つかりませんでした</p>
          </div>
        ) : (
          <StoreCard stores={data} />
        )}
      </div>
      
      {/* モーダル */}
      <StoreModal />
    </>
  );
}

export default function StoresIndexPage({ searchParams }: props) {
  return (
    <Suspense fallback={<StoresIndexSkeleton />}>
      <StoresIndexContent searchParams={searchParams} />
    </Suspense>
  );
}
