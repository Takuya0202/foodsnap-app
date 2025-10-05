"use client";
import { Menu } from "@mui/icons-material";
import { useState } from "react";
import StoreSearch from "@/app/components/layouts/modal/store-search";
export default function HamburgerButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (isOpen) return <StoreSearch setIsOpen={setIsOpen} />;
  return (
    <button
      className="w-[48px] h-[32px] flex justify-center items-center bg-[#3d3d3d]"
      onClick={() => setIsOpen(true)}
    >
      <Menu
        sx={{
          color: "#fff",
        }}
      />
    </button>
  );
}
