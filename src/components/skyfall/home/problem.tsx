import { home } from "@/content/skyfall";
import type { PixelIconName } from "@/lib/skyfall/pixel-art";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { Panel, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { PixelIcon } from "@/components/skyfall/ui/pixel-icon";

const PROBLEM_ICONS: PixelIconName[] = ["plan", "simulate", "energy"];

export function Problem() {
  const problem = home.problem;
  return (
    <Section id="problem" ground="studio">
      <SectionTitle>{problem.title}</SectionTitle>
      <FadeUp as="ol" stagger={0.08} className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
        {problem.points.map((point, index) => (
          <li key={point.title} className="flex">
            <Panel
              className="w-full"
              title={
                <span className="flex w-full justify-between gap-3 py-1">
                  <span>Problem.0{index + 1}</span>
                  <span>[0{index + 1}]</span>
                </span>
              }
            >
              <div className="px-5 pt-6 pb-7 md:px-6">
                <PixelIcon name={PROBLEM_ICONS[index]} active className="size-11" />
                <h3 className="mt-6 text-[22px] leading-[1.15] font-medium tracking-[-0.03em] md:text-2xl">{point.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body">{point.body}</p>
              </div>
            </Panel>
          </li>
        ))}
      </FadeUp>
      <FadeUp className="mt-12 max-w-[980px] border-l-[3px] border-brand pl-5 lg:mt-14">
        {problem.paragraphs.map((paragraph, index) => (
          <p key={paragraph.slice(0, 24)} className={`text-[20px] leading-[1.25] tracking-[-0.03em] md:text-[26px] lg:text-[28px] ${index ? "mt-4 text-brand" : ""}`}>
            {paragraph}
          </p>
        ))}
      </FadeUp>
    </Section>
  );
}
