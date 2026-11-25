export function BeatBars({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-3.5 items-end gap-[2px] ${className}`}
      aria-hidden="true"
    >
      <span className="animate-beat-1 w-[3px] bg-[#facc15]" />
      <span className="animate-beat-2 w-[3px] bg-[#ff5500]" />
      <span className="animate-beat-3 w-[3px] bg-[#facc15]" />
      <span className="animate-beat-4 w-[3px] bg-[#fb923c]" />
    </span>
  );
}
