import BackButton from "@/app/components/elements/buttons/back-button";
import BelongFeature from "@/app/components/elements/stores/belongFeature";
import ShowAddress from "@/app/features/mapbox/show-address";
import { serverClient } from "@/utils/serverClient";
import { client } from "@/utils/setting";
import { AccessTime, ChevronLeft, Link, Phone, Room } from "@mui/icons-material";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type props = {
  params: {
    id: string;
  };
};
function StoreSkeleton() {
  return <div></div>;
}

async function StoreContent({ params }: props) {
  const fetchData = async (id: string) => {
    const client = await serverClient();
    try {
      const res = await client.api.store[":storeId"].$get({
        param: {
          storeId: id,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        return data;
      } else if (res.status === 404) {
        notFound();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error) {
      throw error; // error.tsxに飛ばす
    }
  };
  // 店舗の詳細情報を取得
  const data = await fetchData(params.id);
  return (
    <div
      className="w-full h-full max-w-[480px] mx-auto
    flex flex-col items-start space-y-4 p-4 overflow-y-scroll"
    >
      <div className="flex items-center space-x-2">
        <ChevronLeft sx={{ color: "white", width: 24, height: 24 }} />
        <BackButton className="text-white font-semibold text-[20px]">戻る</BackButton>
      </div>

      <div className="flex items-center space-x-8">
        <p className="text-white text-[24px] font-semibold">{data.name}</p>
        <span className="text-sm text-[#ccc]">{data.genre || ""}</span>
      </div>

      {/* タグ */}
      <div className="w-full overflow-x-scroll flex items-center space-x-2 whitespace-nowrap py-4">
        {data.tags?.map((tag) => (
          <BelongFeature key={tag.id}>
            {tag.name}
          </BelongFeature>
        ))}
      </div>

      {/* 店舗詳細 */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">detail</span>
        <div className="bg-[#1f1f1f] p-4 rounded-sm flex flex-col space-y-4 items-start">
          {/* 住所。絶対ある */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Room sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">住所</span>
            </div>
            <span className="text-sm text-white">{data.address}</span>
          </div>
          {/* 電話番号。絶対ある */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Phone sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">電話番号</span>
            </div>
            <a href={`tel:${data.phone}`} className="text-sm text-[#3d91ff]">{data.phone}</a>
          </div>

          {/* 営業時間。なかったら非表示 */}
          {data.startAt && data.endAt && (
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <AccessTime sx={{ color: "white", width: 24, height: 24 }} />
                <span className="text-sm text-white">営業時間</span>
              </div>
              <span className="text-sm text-white">{data.startAt} ~ {data.endAt}</span>
            </div>
          )}

          {/* 公式サイト。なかったら非表示 */}
          {data.link && (
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <Link sx={{ color: "white", width: 24, height: 24 }} />
                <span className="text-sm text-white">公式サイト</span>
              </div>
              <a href={data.link} className="text-sm text-[#3d91ff]">{data.link}</a>
            </div>
          )}
        </div>
      </div>

      {/* メニュー */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">menu</span>
      </div>

      {/* 位置情報 */}
      <div className="w-full h-[400px] flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">address</span>
        <ShowAddress latitude={data.latitude} longitude={data.longitude} />
      </div>
    </div>
  );
}
export default function StorePage({ params }: props) {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreContent params={params} />
    </Suspense>
  );
}
