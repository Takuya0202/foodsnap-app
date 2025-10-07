type props = {
  status: "req" | "opt";
};
export default function FieldStatusButton({ status }: props) {
  return (
    <button
      type="button"
      className="p-1 text-white"
      style={{ backgroundColor: status === "req" ? "#f20000" : "#908D8D" }}
    >
      {status === "req" ? "必須" : "任意"}
    </button>
  );
}
