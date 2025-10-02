import HumbergerButton from "../../atoms/buttons/humberger-button";
import KeywordInput from "../../atoms/input/keyword-input";

export default function SpUserHeader() {
  return (
    <>
      <div
        className="w-full py-4 px-5 flex justify-between items-center bg-[#181818]
        fixed top-0 z-50"
      >
        <KeywordInput />
        <HumbergerButton />
      </div>

      <div className="w-full h-[64px]"></div>
    </>
  );
}
