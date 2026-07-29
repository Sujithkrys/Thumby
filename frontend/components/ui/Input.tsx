interface InputProps {
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Input primitive — styled to match prototype's input design.
 */
export function Input({
  label,
  type = "text",
  value,
  placeholder,
  readOnly = false,
  onChange,
  className = "",
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[12px] text-slate mb-[6px] font-body">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink box-border"
      />
    </div>
  );
}
