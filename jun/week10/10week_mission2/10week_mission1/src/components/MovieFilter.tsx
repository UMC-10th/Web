import { useState, memo } from "react";
import type { MovieFilters } from "../types/movie";
import { Input } from "./input";
import { SelectBox } from "./SelectBox";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import LanguageSelector from "./LanguageSelector";
import type { ReactElement } from "react";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps): ReactElement => {
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();


    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };

    onChange(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#05110d]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-emerald-500/10"
    >
      <div className="flex flex-wrap items-end gap-6">
        <div className="min-w-[280px] sm:min-w-[400px] flex-[2]">
          <label className="mb-2 block text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            영화 제목
          </label>
          <Input value={query} onChange={setQuery} />
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            옵션
          </label>
          <SelectBox
            checked={includeAdult}
            onChange={setIncludeAdult}
            label="성인 콘텐츠 표시"
            id="include_adult"
            className="w-full h-11 bg-[#020806] border border-white/10 rounded-xl px-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner flex items-center"
          />
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            언어
          </label>
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            options={LANGUAGE_OPTIONS}
            className="w-full h-11 bg-[#020806] border border-white/10 rounded-xl px-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner"
          />
        </div>

        <div className="w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 h-11 flex items-center justify-center font-semibold text-xs text-[#030a08] bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-lg transition duration-200 cursor-pointer"
          >
            영화 검색
          </button>
        </div>
      </div>
    </form>
  );
};

export default memo(MovieFilter);
