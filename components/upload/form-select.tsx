// components/upload/form-select.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FormSelect({
  label,
  placeholder,
  options,
  onValueChange,
  value,
}: any) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label className="text-[15px] font-black uppercase tracking-[0.1em] text-emerald-600 ml-1">
          {label}
        </Label>
      )}
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="min-h-10 w-full rounded-lg border-2 border-slate-100 bg-white px-4 font-bold text-slate-700 shadow-sm transition-all focus:border-emerald-500 focus:ring-0 hover:border-slate-200">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2 border-slate-100 shadow-xl">
          <SelectGroup>
            {options.map((opt: any) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="py-3 rounded-xl font-medium focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
