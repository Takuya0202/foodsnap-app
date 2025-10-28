"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>エラーが発生しました。</h1>
      <p>{error.message}</p>
      <button onClick={reset}>再読み込み</button>
    </div>
  );
}
