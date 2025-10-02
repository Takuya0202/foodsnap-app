"use client";
import { useFooter } from "@/app/zustand/footer";
import { Home } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function TopButton() {
  const router = useRouter();
  const { top, setButton } = useFooter();
  const handleClick = () => {
    setButton("top");
    router.push("/stores/top");
  };
  return (
    <button
      className="rounded-full p-2 hover:bg-[#d7d7d7] "
      onClick={handleClick}
      style={{ backgroundColor: top ? "rgba(215, 215, 215, 0.7)" : "transparent" }}
    >
      <Home sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
    </button>
  );
}
