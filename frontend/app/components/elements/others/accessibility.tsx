"use client";
import { Comment, Favorite } from "@mui/icons-material";

type props = {
  count?: number;
  label?: "like" | "comment";
  loading: boolean;
};

export default function Accessibility({ count, label, loading }: props) {
  if (loading) {
    return (
      <div className="w-[400px] h-[140px] bg-[#1e1e1e] rounded-2xl flex items-center">
        <div className="w-20 h-20 rounded-full bg-[#545454] flex items-center justify-center mx-6"></div>
        <p className="text-white text-4xl">0</p>
      </div>
    );
  }
  return (
    <div className="w-[400px] h-[140px] bg-[#1e1e1e] rounded-2xl flex items-center">
      <div className="w-20 h-20 rounded-full bg-[#545454] flex items-center justify-center mx-6">
        {label === "like" ? (
          <Favorite
            sx={{
              color: "#f20000",
              width: "32px",
              height: "32px",
            }}
          />
        ) : (
          <Comment
            sx={{
              color: "#d9d9d9",
              width: "32px",
              height: "32px",
            }}
          />
        )}
      </div>
      <p className="text-white text-4xl">{count}</p>
    </div>
  );
}
