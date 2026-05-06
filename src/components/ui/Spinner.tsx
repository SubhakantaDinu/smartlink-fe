export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  );
}
