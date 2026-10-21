import { home } from "@/content/skyfall";
import { bodyText, cardTitle, monoLabel } from "@/lib/skyfall/classes";
import { SECTOR_TONES, type PixelIconName } from "@/lib/skyfall/pixel-art";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { LabelBlock, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { SectorTile } from "@/components/skyfall/ui/tiles";

const SECTOR_ICONS: PixelIconName[] = ["industrial", "manufacturing", "enterprise", "healthcare", "beyond"];

export function Matters() {
  const matters = home.matters;
  const last = matters.sectors.length - 1;
  return (
    <Section id="matters">
      <SectionTitle align="left">{matters.title}</SectionTitle>
      <FadeUp className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-12">
        <LabelBlock label={<span aria-hidden="true" className="block size-2 bg-brand" />}>
          <p className={`${bodyText} text-[20px] md:text-[26px]`}>
            {matters.description.before}
            <span className="text-brand">{matters.description.emphasis}</span>
            {matters.description.after}
          </p>
        </LabelBlock>
        <LabelBlock label={matters.qualities.join(" / ")}>
          <p className={bodyText}>{matters.body}</p>
        </LabelBlock>
      </FadeUp>
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-line md:grid-cols-6 lg:mt-14 lg:grid-cols-5">
        {matters.sectors.map((sector, index) => (
          <SectorTile
            key={sector}
            icon={SECTOR_ICONS[index]}
            tone={SECTOR_TONES[index]}
            className="min-h-40 last:col-span-2 md:col-span-2 md:min-h-52 md:nth-[n+4]:col-span-3 lg:col-span-1 lg:nth-[n+4]:col-span-1"
          >
            <span aria-hidden={index === last || undefined} className={`${monoLabel} block text-faint ${index === last ? "invisible" : ""}`}>
              [0{index + 1}]
            </span>
            <span className={`${cardTitle} mt-1 block`}>{sector}</span>
          </SectorTile>
        ))}
      </ul>
    </Section>
  );
}
