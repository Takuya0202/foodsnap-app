type props = {
  name: string;
  isChecked?: boolean;
  onChange?: () => void;
};

export default function CheckBox({ name, isChecked = false, onChange }: props) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={name}
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 accent-[#2ecc71] cursor-pointer"
      />
      <label htmlFor={name} className="cursor-pointer select-none">
        {name}
      </label>
    </div>
  );
}
