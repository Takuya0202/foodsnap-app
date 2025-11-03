type props = {
  fontSize?: number;
};
export default function Logo({ fontSize = 24 }: props) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center">
        <span className="text-white font-bold" style={{ fontSize: `${fontSize}px` }}>
          Food
        </span>
        <span className="text-white font-bold" style={{ fontSize: `${fontSize}px` }}>
          Snap
        </span>
      </div>
    </div>
  );
}
