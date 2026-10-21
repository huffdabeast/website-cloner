import { homeHero, routes, sky001 } from "@/content/skyfall";
import { bodyText, container, gutter, heroTitle } from "@/lib/skyfall/classes";
import { FadeUp, SplitReveal } from "@/components/skyfall/motion/reveal";
import { LineButton, PrimaryButton } from "@/components/skyfall/ui/buttons";
import { HeroField } from "@/components/skyfall/ui/halftone-field";

export function Hero() {
  return (
    <section
      id="top"
      className={`relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-paper ${gutter} pt-28 pb-20 md:pt-36 lg:min-h-svh lg:pt-48`}
    >
      <HeroField />
      <FadeUp stagger={0.12} delay={0.15} className={`relative z-10 ${container} flex flex-col items-center text-center`}>
        <SplitReveal as="h1" immediate delay={0.25} className={`${heroTitle} max-w-[13ch] lg:text-[136px]`}>
          {homeHero.title}
        </SplitReveal>
        <p className={`${bodyText} mt-8 max-w-[38ch] text-body`}>{homeHero.lede}</p>
        <div className="mt-8 flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row md:mt-12">
          <PrimaryButton href={routes.sky001}>{homeHero.primaryCta.label}</PrimaryButton>
          <LineButton href={routes.launchVideo}>{sky001.intro.video.label}</LineButton>
        </div>
      </FadeUp>
    </section>
  );
}
