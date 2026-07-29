interface GenerationCounterProps {
  used: number;
  cap: number;
}

/**
 * Generation counter with progress bar.
 * Shows "Generations X/Y" with a flare-colored progress bar.
 */
export function GenerationCounter({ used, cap }: GenerationCounterProps) {
  const percentage = cap > 0 ? (used / cap) * 100 : 0;

  return (
    <div className="bg-studio rounded-[12px] p-[11px_12px] mb-[10px]">
      <div className="flex justify-between font-body text-[11px] text-slate mb-[6px]">
        <span>Generations</span>
        <span>
          {used}/{cap}
        </span>
      </div>
      <div className="h-[5px] bg-border-light rounded-[3px] overflow-hidden">
        <div
          className="h-full bg-flare rounded-[3px] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
