"use client";

import { Icon } from "@iconify/react";

export default function NavTriggerButton() {
  function handleClick() {
    document.dispatchEvent(new CustomEvent("route:start-navigation"));
  }

  return (
    <button
      onClick={handleClick}
      className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95 cursor-pointer"
    >
      <Icon icon="mdi:navigation" className="w-4 h-4" />
      Mulai Navigasi
    </button>
  );
}
