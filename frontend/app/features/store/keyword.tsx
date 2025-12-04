"use client";

import { Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Keyword() {
  const searchParams = useSearchParams();
  const keyQuery = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setKeyword(keyQuery);
  }, [keyQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/stores/index?keyword=${keyword}`);
    setKeyword("");
  };
  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center justify-between">
      <input
        type="text"
        className="w-full h-[32px] bg-[#3d3d3d] py-2 pl-8 focus:outline-none
        placeholder:text-white placeholder:text-[16px] text-white text-[16px]"
        placeholder="キーワードを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-[#3d3d3d] p-2 w-[32px] h-[32px] flex items-center justify-center"
      >
        <Search sx={{ color: "white", width: 24, height: 24 }} />
      </button>
    </form>
  );
}
