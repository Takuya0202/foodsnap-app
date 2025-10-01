type props = {
  placeholder?: string;
  label?: string;
  type?: string;
};
export default function InputText({ placeholder, label, type, ...props }: props) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label htmlFor={label} className="text-white">
        {label}
      </label>
      <input
        type={type || "text"}
        className="px-2 py-1.5 bg-[#181818] border-2 border-[#b9b9b9] text-[#b9b9b9] rounded-[8px] placeholder:text-[#b9b9b9] placeholder:opacity-70"
        placeholder={placeholder}
        id={label}
        {...props}
      />
    </div>
  );
}
