export default function Logo() {
  return (
    <div className="flex items-center space-x-3">
      {/* 食事アイコン */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* フォーク */}
        <path d="M3 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 8L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 16L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* ナイフ */}
        <path d="M21 3L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 3L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* スプーン */}
        <path
          d="M9 3C9 2.44772 9.44772 2 10 2C10.5523 2 11 2.44772 11 3V8C11 8.55228 10.5523 9 10 9C9.44772 9 9 8.55228 9 8V3Z"
          fill="currentColor"
        />
        <path d="M9 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* FoodSnapテキスト */}
      <div className="flex items-center">
        <span className="text-white text-2xl font-bold tracking-tight">Food</span>
        <span className="text-white text-2xl font-bold tracking-tight">Snap</span>
      </div>
    </div>
  );
}
