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
    <label className="search">
      <Search size={18} />
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="キーワードで絞り込む..." />
    </label>
  );
}
