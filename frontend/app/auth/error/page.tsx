import Link from "next/link";

export default function ErrorPage() {
    return (
        <div>
            <h1>認証エラーが発生しました。もう一度お試しください。</h1>
            <Link href={'/login'}>ログインページへ戻る</Link>
        </div>
    )
}