import { home } from "@/content/skyfall";
import { bodyText } from "@/lib/skyfall/classes";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { LabelBlock, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { BuildSteps } from "./build-steps";

export function Build() {
  return (
    <Section>
      <SectionTitle>{home.build.title}</SectionTitle>
      <FadeUp className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-12">
        <LabelBlock label="[01]">
          <p className={`${bodyText} text-[20px] md:text-[26px]`}>{home.build.lead}</p>
        </LabelBlock>
        <LabelBlock label="[02]">
          <p className={bodyText}>{home.build.rest}</p>
        </LabelBlock>
      </FadeUp>
      <div className="mt-10 lg:mt-14">
        <BuildSteps />
      </div>
    </Section>
  );
}
