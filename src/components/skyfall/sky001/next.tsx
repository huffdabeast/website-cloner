import { sky001 } from "@/content/skyfall";
import { bodyText } from "@/lib/skyfall/classes";
import { DOMAIN_ICONS, DOMAIN_TONES, type PixelIconName, type PixelTone } from "@/lib/skyfall/pixel-art";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { LabelBlock, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { PixelIcon } from "@/components/skyfall/ui/pixel-icon";

function DomainTile({ name, icon, tone }: { name: string; icon: PixelIconName; tone: PixelTone }) {
  return (
    <li className="flex min-h-32 flex-col justify-between gap-4 border-r border-b border-line p-4 transition-colors hover:bg-studio">
      <PixelIcon name={icon} active className="size-10 lg:size-12" color={tone.color} ghost={tone.ghost} />
      <span className="font-mono text-[13px] font-medium tracking-[-0.01em] text-ink md:text-sm">{name}</span>
    </li>
  );
}

export function Sky001Next() {
  const { next } = sky001;
  return (
    <Section>
      <SectionTitle>{next.title}</SectionTitle>
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <FadeUp className="flex">
          <LabelBlock label="[01]">
            <p className={bodyText}>{next.body}</p>
          </LabelBlock>
        </FadeUp>
        <FadeUp className="flex flex-col justify-between gap-8">
          <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3">
            {next.domains.map((domain, index) =>
              domain === "Molecule design" ? null : <DomainTile key={domain} name={domain} icon={DOMAIN_ICONS[index]} tone={DOMAIN_TONES[index]} />,
            )}
          </ul>
          <LabelBlock label="[02]">
            <p className={`${bodyText} text-[20px] text-brand md:text-[26px]`}>{next.closing}</p>
          </LabelBlock>
        </FadeUp>
      </div>
    </Section>
  );
}
