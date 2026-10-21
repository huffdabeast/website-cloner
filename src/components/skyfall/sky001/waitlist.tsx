import { routes, sky001 } from "@/content/skyfall";
import { heroTitle } from "@/lib/skyfall/classes";
import { SplitReveal } from "@/components/skyfall/motion/reveal";
import { LineButton, PrimaryButton } from "@/components/skyfall/ui/buttons";
import { GridField, Section } from "@/components/skyfall/ui/layout";

export function Sky001Waitlist() {
  const { waitlist, video } = sky001.intro;
  return (
    <Section id="waitlist" field={<GridField mask="linear-gradient(to bottom, transparent, #000 30%, #000 calc(100% - 120px), transparent)" />}>
      <div className="flex flex-col items-center text-center">
        <p className="text-[15px] font-medium tracking-[-0.02em] md:text-base">{waitlist.title}</p>
        <SplitReveal as="h2" className={`${heroTitle} mt-6 max-w-[11ch]`}>
          {waitlist.body}
        </SplitReveal>
        <div className="mt-8 flex flex-col items-center gap-3 md:mt-12">
          <PrimaryButton href={routes.waitlist}>{waitlist.cta.label}</PrimaryButton>
          <LineButton href={routes.launchVideo} className="border-b-0">
            {video.label}
          </LineButton>
        </div>
      </div>
    </Section>
  );
}
