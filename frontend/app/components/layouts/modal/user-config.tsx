"use client";
import { useUser } from "@/app/zustand/user";
import LinkButton from "../../elements/buttons/link-button";
import UserIcon from "../../elements/icons/user-icon";
import UserLogout from "@/app/features/auth/logout";
import UserDelete from "@/app/features/user/user-delete";
import { Close, ExitToApp, Store } from "@mui/icons-material";
import "./animation.css";
// ユーザーの設定を開くモーダル
type props = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function UserConfig({ setIsOpen }: props) {
  const { isAuthenticated, name } = useUser();

  return (
    <div className="w-full h-screen bg-[#3d3d3d] z-50 fixed top-0 right-0 flex justify-end animate-[fadeIn_0.3s_ease-in-out]">
      {/* モーダル本体 */}
      <div className="w-[70%] max-w-[320px] h-full bg-[#181818] animate-[slideInRight_0.3s_ease-in-out]">
        <div className="flex flex-col items-start p-4 space-y-8">
          {/* closeボタン */}
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="mr-3">
              <Close
                sx={{
                  color: "#3d3d3d",
                }}
              />
            </button>
          </div>
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-10">
                <UserIcon />
                <p className="text-white text-lg">{name}</p>
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
              href="/auth/admin/login"
              icon={<Store sx={{ color: "#ffffff", width: "24px", height: "24px" }} />}
              richMode={true}
              className="text-white"
            >
              店舗登録はこちら
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
