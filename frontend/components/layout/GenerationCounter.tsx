interface GenerationCounterProps {
  used: number;
  cap: number;
  isExpanded?: boolean;
}

/**
 * Generation counter with progress bar.
 * Shows "Generations X/Y" with a flare-colored progress bar.
 * Collapsed state: just shows a mini icon/text or hides entirely.
 */
export function GenerationCounter({ used, cap, isExpanded = true }: GenerationCounterProps) {
  const percentage = cap > 0 ? (used / cap) * 100 : 0;

  if (!isExpanded) {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-studio text-[10px] font-mono text-slate mb-[10px] flex-col leading-tight" title={`Generations: ${used}/${cap}`}>
        <span>{used}</span>
        <span className="opacity-50">/</span>
        <span>{cap}</span>
      </div>
    );
  }

  return (
    <div className="bg-studio rounded-[12px] p-[11px_12px] mb-[10px] w-full box-border">
      <div className="flex justify-between font-body text-[11px] text-slate mb-[6px]">
        <span>Generations</span>
        <span>
          {used}/{cap}
        </span>
      </div>
      <div className="h-[5px] bg-border-light rounded-[3px] overflow-hidden w-full">
        <div
          className="h-full bg-flare rounded-[3px] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
