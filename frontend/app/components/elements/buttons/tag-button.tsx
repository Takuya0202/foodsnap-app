import { Close } from "@mui/icons-material";

type props = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function TagButton({ name, isSelected, onClick }: props) {
  return (
    <button
      className="bg-[#2a2a2a] rounded-[32px] px-[18px] py-2 text-white
      flex items-center space-x-2"
      onClick={onClick}
      type="button"
      style={{
        backgroundColor: isSelected ? "#3c28c2" : "#2a2a2a",
      }}
    >
      {isSelected && (
        <Close
          sx={{
            width: "16px",
            height: "16px",
            color: "white",
          }}
        />
      )}
      <span>{name}</span>
    </button>
  );
}
