"use client";
import { useUser } from "@/app/zustand/user";
import { client } from "@/utils/setting";
import { useEffect, useState } from "react";

// ユーザー情報を取得するフック
export const useAuth = () => {
  const { isChecked, setUser, setAuthFailed } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const res = await client.api.user.detail.$get();
      if (res.status === 200) {
        const data = await res.json();
        setUser(data.id, data.name, data.icon || "", data.likeStores);
      } else {
        // 認証失敗
        setAuthFailed();
      }
      setIsLoading(false);
    };

    // ユーザー情報の取得が必要かどうか
    if (isChecked) {
      checkAuth();
    }
  }, [isChecked, setUser, setAuthFailed]);

  return { isLoading };
};
