type props = {
  name: string;
  isSelected: boolean;
  handleClick: () => void;
};
export default function GenreButton({ name, isSelected = false, handleClick }: props) {
  return (
    <button
      className="bg-[#2a2a2a] rounded-[32px] px-[18px] py-2 text-white"
      type="button"
      onClick={handleClick}
      style={{
        backgroundColor: isSelected ? "#2ecc71" : "#2a2a2a",
      }}
    >
      <p>{name}</p>
    </button>
  );
}
