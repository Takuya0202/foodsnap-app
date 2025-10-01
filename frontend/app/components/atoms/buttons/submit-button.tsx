type props = {
  width : string,
  height : string,
  text : string,
  isSubmitting : boolean
};

export default function SubmitButton({ width, height, text, isSubmitting }: props) {
  return (
    <button type="submit" className="text-center text-white rounded-[4px] bg-[#3c28c2]"
    style={{width : `${width}px`, height : `${height}px`, opacity : isSubmitting ? 0.5 : 1}} disabled={isSubmitting}>
      {isSubmitting ? '送信中...' : text}
    </button>
  );
}