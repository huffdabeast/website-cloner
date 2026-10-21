import { backers } from "@/content/skyfall";
import { cardTitle } from "@/lib/skyfall/classes";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { Panel, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { LogoGrid } from "@/components/skyfall/ui/tiles";

export function Backers() {
  return (
    <Section className="border-b border-line">
      <SectionTitle size="md">{backers.title}</SectionTitle>
      <FadeUp className="mt-10 lg:mt-14">
        <LogoGrid names={backers.investors} cols="grid-cols-2 lg:grid-cols-4" />
      </FadeUp>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14">
        {backers.advisors.map((advisor) => (
          <li key={advisor.name}>
            <Panel title={advisor.affiliations.join(" / ")}>
              <div className="flex items-center justify-between gap-4 p-4">
                <h3 className={cardTitle}>{advisor.name}</h3>
                <a
                  href={advisor.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${advisor.name} on X`}
                  className="group inline-flex h-11 shrink-0 items-center gap-3 border border-ink px-4 text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[15px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-xl font-medium tracking-[-0.04em] text-muted md:text-2xl">{backers.more}</p>
    </Section>
  );
}
