"use client";

import Image from "next/image";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src="/logo-ptq.svg" width={32} height={32} alt="ptq-logo" />
          </div>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
