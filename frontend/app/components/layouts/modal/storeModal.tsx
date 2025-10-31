"use client";
import { useStoreModal } from "@/app/zustand/storeModal";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { SwipePostContent } from "@/app/components/elements/stores/swipePost";
import { ChevronLeft } from "@mui/icons-material";
import CommentModal from "./commentModal";
import { useCommentStore } from "@/app/zustand/comment";
import "swiper/css";

export default function StoreModal() {
  const { isOpen, currentStoreId, stores, closeModal } = useStoreModal();
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const { isOpen: isCommentOpen, closeComment } = useCommentStore();
  const swiperRef = useRef<SwiperRef | null>(null);

  useEffect(() => {
    if (isOpen && currentStoreId && stores.length > 0) {
      // タップされた投稿のインデックス番号を取得
      const index = stores.findIndex((store) => store.id === currentStoreId);
      if (index !== -1) {
        setCurrentStoreIndex(index);
        setTimeout(() => {
          swiperRef.current?.swiper.slideTo(index, 0);
        }, 0);
      }
    }
  }, [isOpen, currentStoreId, stores]);

  // コメント表示中のスワイプを制御
  useEffect(() => {
    if (isCommentOpen) {
      swiperRef.current?.swiper.disable();
    } else {
      swiperRef.current?.swiper.enable();
    }
  }, [isCommentOpen]);

  if (!isOpen || stores.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#3d3d3d] w-full ">
      {/* 閉じるボタン */}
      <div className="w-[90%] mx-auto justify-start mt-10">
        <button onClick={closeModal} className="flex items-center space-x-2">
          <ChevronLeft sx={{color : "white" , width : 24 , height : 24 }} />
          <span className="text-white text-2xl font-semibold">戻る</span>
        </button>
      </div>

      <div className="w-full h-full max-h-[800px] max-w-[480px] mx-auto">
        <Swiper
          spaceBetween={10}
          ref={swiperRef}
          direction="vertical"
          slidesPerView={1.05}
          speed={500}
          threshold={50}
          modules={[Mousewheel]}
          initialSlide={currentStoreIndex}
          onSlideChange={(swiper) => {
            setCurrentStoreIndex(swiper.activeIndex);
            closeComment();
          }}
          className="w-full h-full"
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
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
                />
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
    </div>
  );
}