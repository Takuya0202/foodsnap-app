import GoogleLogin from "../atoms/buttons/google-login";

export default function LoginForm() {
    return (
        <div className="bg-[#181818] flex flex-col items-center justify-center space-y-4">
            <h1>Logo</h1>
            <GoogleLogin />
        </div>
    )
}