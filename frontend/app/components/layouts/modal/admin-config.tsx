"use client";

import { Close, Info, Menu, RestartAlt } from "@mui/icons-material";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import UserLogout from "@/app/features/auth/logout";
import AdminDelete from "@/app/features/admin/admin-delete";
import "./animation.css";
import "swiper/css";
import LinkButton from "../../elements/buttons/link-button";

export default function AdminConfig() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClose, setIsClose] = useState<boolean>(false);
  const closeDistance = 50;
  const handleClose = () => {
    setIsClose(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };
  if (!isOpen) {
    return (
      <button
        className="rounded-full p-2 hover:bg-[#d7d7d7]"
        onClick={() => {
          setIsClose(false);
          setIsOpen(true);
        }}
      >
        <Menu sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
      </button>
    );
  }
  return (
    <div
      className={`w-full h-screen bg-[#3d3d3d] z-[60] fixed top-0 right-0 flex justify-end
    ${isClose ? "animate-[slideOutRight_0.3s_ease-in-out_forwards]" : "animate-[fadeIn_0.3s_ease-in-out]"}`}
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
            <div className="flex flex-col items-start p-4 space-y-8">
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

              <div>
                <LinkButton
                  href="/stores/top"
                  icon={<Info sx={{ width: "24px", height: "24px", color: "white" }} />}
                  richMode={true}
                  className="text-white"
                >
                  アプリへ
                </LinkButton>
              </div>
              <div>
                <UserLogout path="admin" />
              </div>
              <div>
                <LinkButton
                  href="/auth/reset-password"
                  icon={<RestartAlt sx={{ width: "24px", height: "24px", color: "white" }} />}
                  richMode={true}
                  className="text-white"
                >
                  パスワードの変更
                </LinkButton>
              </div>
              <div>
                <AdminDelete />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
