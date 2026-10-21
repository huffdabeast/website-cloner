import { sky001 } from "@/content/skyfall";
import { bodySmall } from "@/lib/skyfall/classes";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { LabelBlock, Panel, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { ContrarianFigure } from "./contrarian-figure";

const isFigureIndex = (index: number): index is 0 | 1 | 2 => index === 0 || index === 1 || index === 2;

export function Sky001Contrarian() {
  const { contrarian } = sky001;
  return (
    <Section ground="studio" className="max-md:pt-8">
      <SectionTitle>{contrarian.title}</SectionTitle>
      <FadeUp as="ul" stagger={0.08} className="mt-10 grid gap-10 md:gap-8 lg:mt-14 lg:gap-10 min-[1100px]:grid-cols-3">
        {contrarian.points.map((point, index) => (
          <li key={point.title} className="flex flex-col gap-5 md:max-[1099px]:grid md:max-[1099px]:grid-cols-2 md:max-[1099px]:gap-6">
            <Panel title={<h3>{point.title}</h3>} bodyClassName="bg-paper">
              {isFigureIndex(index) && <ContrarianFigure index={index} />}
            </Panel>
            <LabelBlock label={String(index + 1).padStart(2, "0")} className="flex-1">
              <p className={bodySmall}>{point.body}</p>
            </LabelBlock>
          </li>
        ))}
      </FadeUp>
    </Section>
  );
}
