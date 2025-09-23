"use client"

const API_BASE = "http://localhost:8787";

export default function Login() {
    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE}/api/auth/google`;
    }
    return (
        <div>
            <button onClick={handleGoogleLogin}>google Login</button>
            <form action="">
                <p>email</p>
                
            </form>
        </div>
    )
}