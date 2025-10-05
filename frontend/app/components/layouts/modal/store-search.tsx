"use client";

import Search from "@/app/features/store/search";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Close } from "@mui/icons-material";
type props = {
  setIsOpen: (isOpen: boolean) => void;
};
export default function StoreSearch({ setIsOpen }: props) {
  const [isClose, setIsClose] = useState<boolean>(false);
  const closeDistance = 50;
  const handleClose = () => {
    setIsClose(true);
    // アニメーション終了時にモーダルを閉じる。
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className={`w-full h-screen bg-[#3d3d3d] z-[100] fixed top-0 right-0 flex justify-end
        ${isClose ? "animate-[slideOutRight_0.3s_ease-in-out]" : "animate-[fadeIn_0.3s_ease-in-out]"}`}
    >
      <Swiper
        className="w-full h-full"
        onTouchEnd={(swiper) => {
          const diffX = swiper.touches.currentX - swiper.touches.startX;
          if (diffX > closeDistance) {
            handleClose();
          }
        }}
        allowTouchMove={true}
        resistance={true}
        resistanceRatio={0.85}
      >
        <SwiperSlide>
          <div className="w-[70%] max-w-[320px] h-full bg-[#181818] animate-[slideInRight_0.3s_ease-in-out] ml-auto">
            <div className="flex flex-col items-start p-4 space-y-8 w-full">
              {/* closeボタン */}
              <div className="flex justify-end w-full mt-4 mr-4">
                <button onClick={handleClose}>
                  <Close
                    sx={{
                      color: "white",
                      width: "32px",
                      height: "32px",
                    }}
                  />
                </button>
              </div>
              <Search />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
