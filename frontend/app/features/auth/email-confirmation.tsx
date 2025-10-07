import Check from "../../components/elements/icons/check";

type Props = {
  email: string;
  onBack: () => void;
};

export default function EmailConfirmation({ email, onBack }: Props) {
  return (
    <div
      className="w-[312px] h-auto min-h-[520px] rounded-[10px] bg-[#181818] py-6 px-4
      shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="flex flex-col justify-between items-center w-[96%] mx-auto h-full min-h-[460px]">
        <div>
          <Check />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-[28px] font-bold text-white break-all max-w-full">{email}</h1>
          <p className="text-[16px] text-white">にメールを送信いたしました。</p>
        </div>

        <div className="text-center">
          <p className="text-[16px] text-white">
            送信したメールにアクセスし、
            <br />
            ユーザー登録を完了してください。
          </p>
        </div>

        <div>
          <button className="text-[#3d91ff] cursor-pointer" onClick={onBack}>
            登録フォームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
