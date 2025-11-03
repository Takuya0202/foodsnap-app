"use client";

import Search from "@/app/features/store/search";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Close } from "@mui/icons-material";
type props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export default function StoreSearch({ isOpen, setIsOpen }: props) {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const closeDistance = 50;

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className={`w-full h-screen bg-[#3d3d3d] z-[100] fixed top-0 right-0 flex justify-end overflow-y-scroll
        ${isClosing ? "animate-[slideOutRight_0.3s_ease-in-out_forwards]" : "animate-[fadeIn_0.3s_ease-in-out]"}`}
      onAnimationEnd={handleAnimationEnd}
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
          <div className="w-[70%] max-w-[320px] h-full bg-[#181818] animate-[slideInRight_0.3s_ease-in-out_forwards] ml-auto">
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
              <Search setIsOpen={setIsOpen} />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
