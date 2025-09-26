import { getApiUrl } from '@/utils/setting';
import GoogleIcon from '@mui/icons-material/Google';
export default function GoogleLogin() {
    return (
        <button className='flex items-center justify-between cursor-pointer w-[224px] bg-white text-black rounded-[8px] space-x-2 p-2'
        onClick={() => {
            window.location.href = `${getApiUrl()}/api/auth/google`;
        }}>
            <GoogleIcon />
            Googleでログイン
        </button>
    )
}