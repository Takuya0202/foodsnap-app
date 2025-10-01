type props = {
  placeholder?: string;
  label?: string;
  type?: string;
};
export default function InputText({ placeholder, label , type, ...props}: props) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label htmlFor={label} className="text-white">
        {label}
      </label>
      <input
        type={type || "text"}
        className="px-4 py-3 bg-white text-black rounded-[8px] placeholder:text-black"
        placeholder={placeholder}
        id={label}
        {...props}
      />
    </div>
  );
}
