import { Menu } from "@mui/icons-material";

export default function HumbergerButton() {
  return (
    <button className="w-[48px] h-[32px] flex justify-center items-center bg-[#3d3d3d]">
      <Menu
        sx={{
          color: "#fff",
        }}
      />
    </button>
  );
}
