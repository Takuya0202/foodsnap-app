"use client";
import { useUser } from "@/app/zustand/user";
import LinkButton from "../../elements/buttons/link-button";
import UserIcon from "../../elements/icons/user-icon";
import UserLogout from "@/app/features/auth/logout";
import UserDelete from "@/app/features/user/user-delete";
import { Close, ExitToApp, Store } from "@mui/icons-material";
import "./animation.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";

// ユーザーの設定を開くモーダル
type props = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function UserConfig({ setIsOpen }: props) {
  const { isAuthenticated, name } = useUser();
  const [isClose, setIsClose] = useState<boolean>(false);
  const closeDistance = 50; // 閉じる距離

  const handleClose = () => {
    setIsClose(true);
    // アニメーション終了時にモーダルを閉じる。
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };
  return (
    <div
      className={`w-full h-screen bg-[#3d3d3d] z-[60] fixed top-0 right-0 flex justify-end
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
            <div className="flex flex-col items-start p-4 space-y-8">
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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-8">
                    <UserIcon />
                    <p className="text-white text-lg flex-1">{name}</p>
                  </div>

                  <div>
                    <UserLogout />
                  </div>

                  <div>
                    <UserDelete />
                  </div>
                </>
              ) : (
                <>
                  <LinkButton
                    href="/auth/user/login"
                    icon={<ExitToApp sx={{ color: "#ffffff", width: "24px", height: "24px" }} />}
                    richMode={true}
                    className="text-white"
                  >
                    ログイン
                  </LinkButton>
                </>
              )}
              <div>
                <LinkButton
                  href="/admin/dashboard"
                  icon={<Store sx={{ color: "#ffffff", width: "24px", height: "24px" }} />}
                  richMode={true}
                  className="text-white"
                >
                  店舗管理者画面へ
                </LinkButton>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
