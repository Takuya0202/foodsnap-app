type props = {
  name: string;
};
export default function GenreButton({ name }: props) {
  return (
    <button
      className="bg-[#2a2a2a] rounded-[32px] px-[18px] py-2
    text-white"
    >
      <p>{name}</p>
    </button>
  );
}
