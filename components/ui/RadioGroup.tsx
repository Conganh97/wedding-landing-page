import { cn } from "@/lib/utils";

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium text-charcoal">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-3 transition-colors",
              value === option.value
                ? "border-champagne bg-champagne/10"
                : "border-champagne/25 bg-pearl/60 hover:border-champagne/50",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="accent-champagne"
            />
            <span className="text-sm text-charcoal">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
