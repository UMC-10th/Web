import type { ReactElement } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Input = ({
  value,
  onChange,
  placeholder = "검색어를 입력하세요.",
  className,
}: InputProps): ReactElement => {
  return (
    <input
      type="text"
      className={`w-full h-11 bg-[#020806] border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
