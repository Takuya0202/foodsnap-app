"use client"
import { hc } from "hono/client"
import { AppType } from "../../../backend/src/index"

export default function Login() {
    const handleGoogleLogin = async () => {
        const client = hc<AppType>('http://localhost:8787');
        const res = await client.api.auth.google.$get();
        if (res.status === 200) {
            const data = await res.json();
            window.location.href = data.url ;
        } else {
            const data = await res.json();
            console.log(data.message);
        }
    }
    return (
        <div>
            <form onSubmit={handleGoogleLogin}>
                <button type="submit">google Login</button>
            </form>
        </div>
    )
}