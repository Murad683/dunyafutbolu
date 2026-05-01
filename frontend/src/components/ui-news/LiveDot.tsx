export function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-badge bg-live-bg px-2 py-0.5 text-[0.625rem] font-bold tracking-wider text-live-red uppercase">
      <span className="block size-1.5 rounded-full bg-live-red animate-pulse-dot" />
      Canlı
    </span>
  );
}
