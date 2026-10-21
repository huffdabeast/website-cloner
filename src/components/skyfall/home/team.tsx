import { team } from "@/content/skyfall";
import { headingBase, monoLabel } from "@/lib/skyfall/classes";
import { Counter } from "@/components/skyfall/motion/counter";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { LabelBlock, Panel, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { LogoGrid } from "@/components/skyfall/ui/tiles";

export function Team() {
  return (
    <Section id="team" ground="studio">
      <SectionTitle>{team.title}</SectionTitle>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <FadeUp className="grid gap-8">
          <LabelBlock label="[01]">
            <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.story}</p>
          </LabelBlock>
          <LabelBlock label="[02]">
            <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.experience}</p>
          </LabelBlock>
        </FadeUp>
        <FadeUp
          as="ul"
          stagger={0.08}
          className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 self-start overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible sm:px-0 md:gap-3"
        >
          {team.founders.map((founder) => (
            <li key={founder.name} className="w-[64%] shrink-0 snap-start sm:w-auto">
              <Panel title={founder.note}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={founder.photo} alt={founder.name} loading="lazy" className="aspect-[4/5] w-full bg-studio object-cover" />
              </Panel>
              <h3 className="mt-3 text-[15px] leading-tight font-medium tracking-[-0.04em] sm:text-xl">{founder.name}</h3>
            </li>
          ))}
        </FadeUp>
      </div>
      <dl className="mt-12 grid grid-cols-2 gap-4 lg:mt-20 lg:gap-12">
        {team.stats.map((stat) => (
          <LabelBlock key={stat.label} label={<dt>{stat.label}</dt>}>
            <dd className={`${headingBase} text-[52px] leading-[0.85] text-brand sm:text-[96px] lg:text-[150px]`}>
              <Counter value={stat.value} />
            </dd>
          </LabelBlock>
        ))}
      </dl>
      <FadeUp className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <LabelBlock label="[03]">
          <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.researchTeam}</p>
        </LabelBlock>
        <div>
          <p className={`${monoLabel} mb-3 text-muted`}>{team.experienceLabel}</p>
          <LogoGrid names={team.experienceFrom} />
        </div>
      </FadeUp>
    </Section>
  );
}
