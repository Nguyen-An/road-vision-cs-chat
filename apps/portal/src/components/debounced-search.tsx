"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type DebouncedSearchProps = {
  defaultValue: string;
};

export function DebouncedSearch({ defaultValue }: DebouncedSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams, value]);

  return (
    <label className="relative w-64 min-w-55 max-sm:w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#57697d]" size={18} />
      <input
        className="h-[42px] w-full rounded-lg border border-slate-200 bg-white px-3.5 pl-[42px] text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#f4f8ff]"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="キーワードで絞り込む..."
      />
    </label>
  );
}
