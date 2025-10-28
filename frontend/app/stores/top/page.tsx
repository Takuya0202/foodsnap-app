"use client";
import { SwipePostContent, SwipePostSkeleton } from "@/app/components/elements/stores/swipePost";
import { useToaster } from "@/app/zustand/toaster";
import { storeResponse } from "@/types/store";
import { client } from "@/utils/setting";
import { useEffect, useRef, useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import CommentModal from "@/app/components/layouts/modal/commentModal";
import { useCommentStore } from "@/app/zustand/comment";

function TopSkeleton() {
  return (
    <div>
      <div className="mt-20 max-w-[480px] mx-auto">
        <SwipePostSkeleton />
      </div>
    </div>
  );
}

export default function TopPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stores, setStores] = useState<storeResponse>([]);
  const [currentStoreIndex, setCurrentStoreIndex] = useState<number>(0);
  const { open } = useToaster();
  const { isOpen, closeComment } = useCommentStore();
  const swiperRef = useRef<SwiperRef | null>(null);

  // 初回ロード用のuseEffect
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // 現在地を取得する関数。Promiseでラップしてあげる
      const getPosition = (): Promise<{ latitude: number; longitude: number } | null> => {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos: GeolocationPosition) => {
              const crd = pos.coords;
              resolve({ latitude: crd.latitude, longitude: crd.longitude });
            },
            () => {
              resolve(null);
            }
          );
        });
      };

      const currentPosition = await getPosition();

      // 店舗を取得
      try {
        const res = await client.api.store.top.$get({
          query: {
            latitude: currentPosition?.latitude,
            longitude: currentPosition?.longitude,
          },
        });

        if (res.status === 200) {
          const data = await res.json();
          setStores(data);
        } else {
          const data = await res.json();
          open(data.error, "error");
        }
      } catch {
        open("店舗の取得に失敗しました。", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // 初回のみ実行

  // 追加データのフェッチ関数
  const fetchMoreStores = async () => {
    const getPosition = (): Promise<{ latitude: number; longitude: number } | null> => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos: GeolocationPosition) => {
            const crd = pos.coords;
            resolve({ latitude: crd.latitude, longitude: crd.longitude });
          },
          () => {
            resolve(null);
          }
        );
      });
    };

    const currentPosition = await getPosition();

    try {
      const res = await client.api.store.top.$get({
        query: {
          latitude: currentPosition?.latitude,
          longitude: currentPosition?.longitude,
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        setStores((prev) => [...prev, ...data]);
      } else {
        const data = await res.json();
        open(data.error, "error");
      }
    } catch {
      open("店舗の取得に失敗しました。", "error");
    }
  };

  // コメント表示中のスワイプを制御する
  useEffect(() => {
    if (isOpen) {
      swiperRef.current?.swiper.disable();
    } else {
      swiperRef.current?.swiper.enable();
    }
  }, [isOpen]);

  if (isLoading) {
    return <TopSkeleton />;
  }

  return (
    <div className="w-full h-full max-h-[800px] max-w-[480px] mx-auto">
      <Swiper
        spaceBetween={10}
        ref={swiperRef}
        direction="vertical"
        slidesPerView={1.05}
        speed={500}
        threshold={50}
        modules={[Mousewheel]}
        onSlideChange={(swiper) => {
          setCurrentStoreIndex(swiper.activeIndex);
          closeComment();
        }}
        className="w-full h-full"
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
        }}
        onReachEnd={() => {
          fetchMoreStores(); // 追加で取得
        }}
      >
        {stores.map((store, idx) => (
          <SwiperSlide key={idx} className="h-full w-full">
            <div className="w-full h-full relative">
              {/* 現在表示してるスライドは高さをもうける。全てにつけるとチラ見セができないため。 */}
              <div
                style={{
                  height: idx === currentStoreIndex ? "80px" : "0px",
                  transition: "height 0.3s ease-in-out",
                }}
                className="w-full"
              ></div>
              <SwipePostContent
                id={store.id}
                name={store.name}
                address={store.address}
                genre={store.genre}
                likeCount={store.likeCount}
                commentCount={store.commentCount}
                posts={store.posts}
                currentLike={store.isLiked}
              />
              <CommentModal storeId={store.id} commentCount={store.commentCount} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
