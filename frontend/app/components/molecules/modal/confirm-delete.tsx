import ConfirmDeleteButton from "../../atoms/buttons/confirmDelete-button";

type props = {
  setIsOpen: (close: boolean) => void;
};
export default function ConfirmDelete({ setIsOpen }: props) {
  return (
    <div className="flex justify-center items-center bg-[rgba(0,0,0,0.6)] w-full h-full">
      <div
        className="flex flex-col bg-[#181818] w-[86%] mx-auto rounded-[6px] p-4
      shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
      >
        <div>
          <h1 className="text-[#ff0000] text-lg font-bold">警告</h1>
        </div>

        <div>
          <p className="text-[#b7b7b7] text-sm">
            アカウントを削除すると、ユーザー情報が完全に削除され、復元することができません。
            <br />
            本当に削除しますか？
          </p>
        </div>

        <div className="flex justify-between gap-2 items-center">
          <ConfirmDeleteButton />
          <button className="text-[#3d91ff] text-sm" onClick={() => setIsOpen(false)}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
