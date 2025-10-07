type props = {
  value: {
    id: number;
    name: string;
  }[];
};
export default function SelectBox({ value, ...props }: props) {
  return (
    <div className="w-full">
      <select
        className="px-2 py-1.5 bg-[#181818] border-2 border-[#b9b9b9] text-[#b9b9b9] rounded-[8px] w-full"
        {...props}
      >
        {value.map((item) => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
