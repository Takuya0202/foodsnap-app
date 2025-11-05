"use client";
import { useUser } from "@/app/zustand/user";
import { client } from "@/utils/setting";
import { useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isChecked, setUser, setAuthFailed } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await client.api.user.detail.$get();
        if (res.status === 200) {
          const data = await res.json();
          setUser(data.id, data.name, data.icon || "");
        } else {
          setAuthFailed();
        }
      } catch (error) {
        setAuthFailed();
      } finally {
        setIsInitialized(true);
      }
    };

    if (isChecked) {
      checkAuth();
    } else {
      setIsInitialized(true);
    }
  }, [isChecked, setUser, setAuthFailed]);

  // 初期化中の表示
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">読み込み中...</p>
      </div>
    );
  }

  return <>{children}</>;
};
