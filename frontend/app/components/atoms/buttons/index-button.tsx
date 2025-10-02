"use client";
import { Apps } from "@mui/icons-material";
import { useFooter } from "@/app/zustand/footer";
import { useRouter } from "next/navigation";

export default function IndexButton() {
  const { index, setButton } = useFooter();
  const router = useRouter();
  const handleClick = () => {
    setButton("index");
    router.push("/stores/index");
  };
  return (
    <button
      className="rounded-full p-2 hover:bg-[#d7d7d7]"
      style={{ backgroundColor: index ? "rgba(215, 215, 215, 0.7)" : "transparent" }}
      onClick={handleClick}
    >
      <Apps sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
    </button>
  );
}
