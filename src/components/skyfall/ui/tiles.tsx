"use client";

import { useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { logoMedia, logoSlug } from "@/lib/skyfall/media";
import type { PixelIconName, PixelTone } from "@/lib/skyfall/pixel-art";
import { PixelIcon } from "./pixel-icon";

interface SectorTileProps {
  icon: PixelIconName;
  tone?: PixelTone;
  children?: ReactNode;
  className?: string;
}

export function SectorTile({ icon, tone, children, className = "" }: SectorTileProps) {
  const hoverable = useMediaQuery("(hover: hover)");
  const [hovered, setHovered] = useState(false);
  return (
    <li
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`group flex flex-col justify-between gap-8 border-r border-b border-line p-5 transition-colors duration-300 hover:bg-studio md:p-6 ${className}`}
    >
      <PixelIcon name={icon} active={!!tone || hovered || !hoverable} color={tone?.color} ghost={tone?.ghost} className="size-[50px] md:size-16" />
      <div>{children}</div>
    </li>
  );
}

export function LogoGrid({ names, cols = "grid-cols-2 sm:grid-cols-3" }: { names: string[]; cols?: string }) {
  return (
    <ul className={`grid ${cols} border-t border-l border-line`}>
      {names.map((name) => {
        const src = logoMedia[logoSlug(name)];
        return (
          <li key={name} className="flex h-20 items-center justify-center border-r border-b border-line bg-paper px-4 md:h-24">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={name} loading="lazy" className="max-h-8 max-w-[82%] object-contain md:max-h-10" />
            ) : (
              <span className="bg-ink px-1.5 py-0.5 font-mono text-[13px] font-medium text-white">{name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
