import Image from "next/image"

type props = {
    name : string,
    icon : string,
}
export default function UserProfile({ name , icon } : props) {
    // アイコンが空文字列またはnullの場合はデフォルトアイコンを使用
    const iconSrc = icon && icon.trim() !== '' ? icon : '/default-icon.svg';
    
    return (
        <div>
            <h1>UserProfile</h1>
            <Image 
                src={iconSrc} 
                alt="ユーザーアイコン" 
                width={100} 
                height={100}
                className="rounded-full"
            />
            <p>{name}</p>
        </div>
    )
}