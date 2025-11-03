import { Share } from "@mui/icons-material";
type props = {
  name: string;
  id: string;
};
export default function ShareButton({ name, id }: props) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name, // 店舗名
        url: `${window.location.origin}/stores/${id}`,
      });
    }
  };
  return (
    <button onClick={handleShare} className="flex items-center flex-col space-y-1">
      <Share sx={{ color: "white", width: 36, height: 36 }} />
      <span className="text-white text-sm">共有</span>
    </button>
  );
}
