// バリデーションのフィールドエラコンポーネント
export default function FieldError({ children }: { children: React.ReactNode }) {
  return <span className="text-[rgb(255,79,79)] text-sm block break-words">{children}</span>;
}
