import { serverClient } from "@/utils/serverClient";
import { Suspense } from "react";
type props = {
  searchParams: Promise<{
    genreId : string | string[] | undefined;
    prefectureIds: string | string[] | undefined;
    tagIds: string | string[] | undefined;
    keyword: string | string[] | undefined;
  }>
}
function StoresIndexSkeleton() {
  return (
    <div>
      <h1>StoresIndexSkeleton</h1>
    </div>
  );
}

async function StoresIndexContent({ searchParams }: props) {
  // クエリの取得
  const {
    genreId ,
    prefectureIds ,
    tagIds ,
    keyword ,
  } = await searchParams;

  const fetchData = async () => {
    try {
      const client = await serverClient();
      const res = await client.api.store.list.$get({
        query : {
          genreId : genreId,
          prefectureIds : prefectureIds,
          tagIds : tagIds,
          keyword : keyword,
        }
      })
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
  }
  const data = await fetchData();
  return (
    <div className="w-full h-full max-w-[480px] mx-auto
    flex flex-col items-start space-y-4 p-4 overflow-y-scroll">
      {/* 検索クエリを表示 */}
      <div className="w-full flex flex-col space-y-3.5">
        <p className="text-white font-semibold">{keyword && `${keyword}の検索結果`}</p>
      </div>
    </div>
  );
}

export default function StoresIndexPage({ searchParams }: props) {
  return (
    <Suspense fallback={<StoresIndexSkeleton />}>
      <StoresIndexContent searchParams={searchParams} />
    </Suspense>
  );
}
