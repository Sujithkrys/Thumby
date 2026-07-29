interface RightsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Upload confirmation checkbox.
 * Required before an upload-referenced generation can submit.
 * Non-negotiable per scope-lock.md.
 */
export function RightsCheckbox({ checked, onChange }: RightsCheckboxProps) {
  return (
    <label className="flex items-start gap-[6px] text-[11.5px] text-slate mb-[14px] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-[2px]"
      />
      This image is mine, or I have permission to use it.
    </label>
  );
}
