interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * Tab button — used in sort tabs and other tab groups.
 * Active: ink bg, studio text. Inactive: transparent, slate text.
 */
export function Tab({ active, onClick, children }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-[13px] py-[6px] rounded-[8px] text-[12.5px] font-body cursor-pointer border-none transition-colors ${
        active
          ? "bg-ink text-studio font-semibold"
          : "bg-transparent text-slate font-normal hover:bg-studio"
      }`}
    >
      {children}
    </button>
  );
}
