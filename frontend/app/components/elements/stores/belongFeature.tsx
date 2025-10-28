// ジャンルやタグなど店舗の特徴を表示するコンポーネント
type props = {
  children: React.ReactNode;
  className?: string;
};
export default function BelongFeature({ children, className = "" }: props) {
  return (
    <span className={`bg-[#2a2a2a] text-[#ccc] py-2 px-4 rounded-2xl text-base ${className}`}>
      {children}
    </span>
  );
}
