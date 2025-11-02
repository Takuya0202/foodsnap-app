import BackButton from "@/app/components/elements/buttons/back-button";
import BelongFeature from "@/app/components/elements/stores/belongFeature";
import {
  CommentCardContent,
  CommentCardSkeleton,
} from "@/app/components/elements/stores/commentCard";
import { MenuCardContent, MenuCardSkeleton } from "@/app/components/elements/stores/menuCard";
import ShowAddress from "@/app/features/mapbox/show-address";
import { serverClient } from "@/utils/serverClient";
import { AccessTime, ChevronLeft, Link, Phone, Room } from "@mui/icons-material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type props = {
  params: Promise<{
    id: string;
  }>;
};
// 店舗詳細を取得する関数
const fetchData = async (id: string) => {
  // サーバー用クライアントを作成
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

// メタタグ生成
export async function generateMetadata({ params }: props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchData(id);
  return {
    title: data.name,
    description: `${data.name}の詳細情報。`,
    keywords: [
      data.name,
      data?.genre || "",
      ...(data.tags?.map((tag) => tag.name) || []).join(","),
      data.address,
    ],
  };
}
function StoreSkeleton() {
  return (
    <div
      className="w-full h-full max-w-[480px] mx-auto
    flex flex-col items-start space-y-4 p-4 overflow-y-scroll"
    >
      <div className="flex items-center space-x-2">
        <ChevronLeft sx={{ color: "white", width: 24, height: 24 }} />
        <div className="w-[60px] h-[28px] bg-skLoading"></div>
      </div>

      <div className="flex items-center w-full justify-between px-4">
        <div className="w-[200px] h-[32px] bg-skLoading"></div>
        <div className="w-[60px] h-[20px] bg-skLoading"></div>
      </div>

      {/* タグ */}
      <div className="w-full">
        <div className="w-full flex items-start space-x-2 overflow-x-auto">
          <div className="w-[80px] h-[32px] bg-skLoading whitespace-nowrap flex-shrink-0"></div>
          <div className="w-[80px] h-[32px] bg-skLoading whitespace-nowrap flex-shrink-0"></div>
          <div className="w-[80px] h-[32px] bg-skLoading whitespace-nowrap flex-shrink-0"></div>
        </div>
      </div>

      {/* 店舗詳細 */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">detail</span>
        <div className="bg-[#202020] p-4 rounded-sm flex flex-col space-y-4 items-start">
          {/* 住所 */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Room sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">住所</span>
            </div>
            <div className="w-[180px] h-[20px] bg-skLoading"></div>
          </div>
          {/* 電話番号 */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Phone sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">電話番号</span>
            </div>
            <div className="w-[120px] h-[20px] bg-skLoading"></div>
          </div>
          {/* 営業時間 */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <AccessTime sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">営業時間</span>
            </div>
            <div className="w-[100px] h-[20px] bg-skLoading"></div>
          </div>
          {/* 公式サイト */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Link sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">公式サイト</span>
            </div>
            <div className="w-[140px] h-[20px] bg-skLoading"></div>
          </div>
        </div>
      </div>

      {/* メニュー */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">menu</span>
        <div className="w-full flex items-center space-x-4 overflow-x-auto">
          <MenuCardSkeleton />
          <MenuCardSkeleton />
        </div>
      </div>

      {/* 位置情報 */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">address</span>
        <div className="w-full h-[400px] bg-skLoading"></div>
      </div>

      {/* コメント */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">comment</span>
        <div className="w-full flex items-center space-x-4 overflow-x-auto">
          <CommentCardSkeleton />
          <CommentCardSkeleton />
        </div>
      </div>
    </div>
  );
}

async function StoreContent({ params }: props) {
  // params.idではなくいったんawait paramsでawaitしてから分割代入する。
  const { id } = await params;
  // 店舗の詳細情報を取得
  const data = await fetchData(id);
  return (
    <div
      className="w-full h-full max-w-[480px] mx-auto
    flex flex-col items-start space-y-4 p-4 overflow-y-scroll"
    >
      <div className="flex items-center space-x-2">
        <ChevronLeft sx={{ color: "white", width: 24, height: 24 }} />
        <BackButton className="text-white font-semibold text-[20px]">戻る</BackButton>
      </div>

      <div className="flex items-center w-full justify-between px-4">
        <p className="text-white text-[24px] font-semibold w-[70%]">{data.name}</p>
        <span className="text-sm text-[#ccc]">{data.genre || ""}</span>
      </div>

      {/* タグ */}
      <div className="w-full">
        {/* なぜかdivで囲わないとoverflow-x-autoが効かない。おそらく親のoverflow-y-scrollが影響してる？？ */}
        <div className="w-full flex items-start space-x-2 overflow-x-auto">
          {data.tags?.map((tag) => (
            <BelongFeature key={tag.id} className="whitespace-nowrap flex-shrink-0">
              {tag.name}
            </BelongFeature>
          ))}
        </div>
      </div>

      {/* 店舗詳細 */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">detail</span>
        <div className="bg-[#202020] p-4 rounded-sm flex flex-col space-y-4 items-start">
          {/* 住所。絶対ある */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Room sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">住所</span>
            </div>
            <div>
              <span className="text-sm text-white">
                {data.prefectureName ? `${data.prefectureName} ${data.address}` : data.address}
              </span>
            </div>
          </div>
          {/* 電話番号。絶対ある */}
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center space-x-2">
              <Phone sx={{ color: "white", width: 24, height: 24 }} />
              <span className="text-sm text-white">電話番号</span>
            </div>
            <a href={`tel:${data.phone}`} className="text-sm text-[#3d91ff]">
              {data.phone}
            </a>
          </div>

          {/* 営業時間。なかったら非表示 */}
          {data.startAt && data.endAt && (
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <AccessTime sx={{ color: "white", width: 24, height: 24 }} />
                <span className="text-sm text-white">営業時間</span>
              </div>
              <span className="text-sm text-white">
                {data.startAt} ~ {data.endAt}
              </span>
            </div>
          )}

          {/* 公式サイト。なかったら非表示 */}
          {data.link && (
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <Link sx={{ color: "white", width: 24, height: 24 }} />
                <span className="text-sm text-white">公式サイト</span>
              </div>
              <a href={data.link} className="text-sm text-[#3d91ff]">
                {data.link}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* メニュー */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">menu</span>
        <div className="w-full flex items-center space-x-4 overflow-x-auto">
          {data.posts && data.posts.length > 0 ? (
            data.posts.map((post) => (
              <MenuCardContent
                key={post.id}
                name={post.name}
                price={post.price}
                photo={post.photo}
                description={post.description}
              />
            ))
          ) : (
            <div className="w-full h-[224px] flex items-center justify-center">
              <p className="text-white text-sm">メニューはありません。</p>
            </div>
          )}
        </div>
      </div>

      {/* 位置情報 */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">address</span>
        <div className="w-full h-[400px]">
          <ShowAddress latitude={data.latitude} longitude={data.longitude} />
        </div>
      </div>

      {/* コメント */}
      <div className="w-full flex flex-col space-y-4">
        <span className="text-white text-2xl border-b border-white pb-2 w-[50%]">comment</span>
        <div className="w-full flex items-center space-x-4 overflow-x-auto">
          {data.comments && data.comments.length > 0 ? (
            data.comments.map((comment) => (
              <CommentCardContent
                key={comment.id}
                userName={comment.userName}
                userIcon={comment.userIcon}
                content={comment.content}
                createdAt={comment.createdAt}
              />
            ))
          ) : (
            <div className="w-full h-[224px] flex items-center justify-center">
              <p className="text-white text-sm">コメントはありません。</p>
            </div>
          )}
        </div>
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
