"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme, type ThemeMode } from "@/app/theme-provider";

const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システムのテーマ", icon: Laptop }
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const CurrentIcon = options.find((option) => option.value === theme)?.icon ?? Sun;

  return (
    <div className="relative">
      <button
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-px hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
        type="button"
        aria-label="テーマを変更"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <CurrentIcon size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
          {options.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-blue-50 text-blue-600 dark:bg-cyan-950/50 dark:text-cyan-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
                key={value}
                type="button"
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
