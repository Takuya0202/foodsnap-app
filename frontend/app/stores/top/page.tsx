"use client";
import { SwipePostContent, SwipePostSkeleton } from "@/app/components/elements/stores/swipePost";
import { useToaster } from "@/app/zustand/toaster";
import { storeResponse } from "@/types/store";
import { client } from "@/utils/setting";
import { useEffect, useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
          console.log(data);
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
  }, []);

  if (isLoading) {
    return <TopSkeleton />;
  }

  return (
    <div className="w-full h-full max-w-[480px] mx-auto">
      <Swiper
        spaceBetween={10}
        direction="vertical"
        slidesPerView={1.05}
        speed={500}
        threshold={50}
        modules={[Mousewheel]}
        onSlideChange={(swiper) => setCurrentStoreIndex(swiper.activeIndex)}
        className="w-full h-full"
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
        }}
      >
        {stores.map((store, idx) => (
          <SwiperSlide key={store.id} className="h-full w-full">
            <div className="w-full h-full">
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
