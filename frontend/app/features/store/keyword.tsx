"use client";

import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Keyword() {
  const [keyword , setKeyword ] = useState("");
  const router = useRouter();
  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim() === "") {
      return;
    }
    router.push(`/stores/index?keyword=${keyword}`);
  }
  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center justify-between">
      <input
        type="text"
        className="w-full h-[32px] bg-[#3d3d3d] py-2 pl-8
        placeholder:text-white placeholder:text-[12px] text-white text-[12px]"
        placeholder="キーワードを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className="bg-[#3d3d3d] p-2 w-[32px] h-[32px] flex items-center justify-center">
        <Search sx={{ color: "white", width: 24, height: 24 }} />
      </button>
    </form>
  );
}
