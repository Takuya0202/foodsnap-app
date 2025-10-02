"use client";
import { Person } from "@mui/icons-material";
import { useFooter } from "@/app/zustand/footer";
import { useRouter } from "next/navigation";
export default function UserButton() {
  const { user, setButton } = useFooter();
  const router = useRouter();
  const handleClick = () => {
    setButton("user");
    router.push("/user/profile");
  };
  return (
    <button
      className="rounded-full p-2 hover:bg-[#d7d7d7]"
      style={{ backgroundColor: user ? "rgba(215, 215, 215, 0.7)" : "transparent" }}
      onClick={handleClick}
    >
      <Person sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
    </button>
  );
}
