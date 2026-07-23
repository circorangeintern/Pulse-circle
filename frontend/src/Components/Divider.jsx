function Divider({ label = "OR" }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

export default Divider;
