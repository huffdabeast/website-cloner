import { home } from "@/content/skyfall";
import { bodyText } from "@/lib/skyfall/classes";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { Figure, LabelBlock, Panel, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { ParetoChart } from "./pareto-chart";

export function Pareto() {
  return (
    <Section ground="studio">
      <SectionTitle align="left" note={home.pareto.axes.join(" / ")}>
        {home.pareto.title}
      </SectionTitle>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <FadeUp>
          <Figure tag="Pareto.Frontier">
            <Panel title="Cost / Speed / Quality" className="mx-auto max-w-[460px]">
              <ParetoChart />
            </Panel>
          </Figure>
        </FadeUp>
        <FadeUp className="flex">
          <LabelBlock label={<span aria-hidden="true" className="block size-2 bg-brand" />} className="lg:min-h-full">
            <p className={`${bodyText} max-w-[30ch] text-[20px] md:text-[26px]`}>{home.pareto.body}</p>
          </LabelBlock>
        </FadeUp>
      </div>
    </Section>
  );
}
