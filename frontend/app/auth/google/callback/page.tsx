"use client"
import { client } from "@/utils/setting"
import { useRouter, useSearchParams } from "next/navigation";


export default function GoogleCallbackPage() {
    const router = useRouter();

    // useEffect(() => {
    //     const createProfile = async () => {
    //         const res = await client.api.auth.google.callback.$post({
    //             json : {
    //                 code
    //             }
    //         })
    //         if (res.ok) {
    //             console.log("ユーザー情報の確立に成功しました");
    //         } else {
    //             const data = await res.json();
    //             console.log(data.message);
    //         }
    //         setIsLoading(false);
    //     }
    //     createProfile();
    // } , [code]);

    const handleLogout = async () => {
        const res = await client.api.auth.logout.$post();
        if (res.status === 200) {
            router.push('/login');
        } else {
            const data = await res.json();
            console.log(data.message);
        }
    }
    return (
        <div>
            GoogleCallbackPage
            <p></p>
            <form action={handleLogout}>
                <button type="submit">logout</button>
            </form>
        </div>
    )
}