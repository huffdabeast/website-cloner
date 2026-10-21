import { chartMeta, results, sky001, type BenchmarkModel } from "@/content/skyfall";
import { bodyText, cardTitle, headingBase, monoLabel } from "@/lib/skyfall/classes";
import { benchmarkMedia } from "@/lib/skyfall/media";
import { Counter } from "@/components/skyfall/motion/counter";
import { FadeUp } from "@/components/skyfall/motion/reveal";
import { GridField, LabelBlock, Section, SectionTitle } from "@/components/skyfall/ui/layout";
import { VideoFigure } from "@/components/skyfall/ui/video-figure";
import { BarChart } from "./bar-chart";
import { metricLabels, type BenchmarkClip } from "./benchmark";
import { BenchmarkChartTabs, BenchmarkFilms } from "./benchmark-tabs";

function BenchmarkStory({ story, clip }: { story: BenchmarkModel; clip: BenchmarkClip }) {
  return (
    <article aria-label={story.title}>
      <div className="relative overflow-hidden bg-brand px-4 pt-5 pb-6 text-white md:px-6 md:pt-6 md:pb-8">
        <GridField tone="blue" mask="linear-gradient(to bottom, #000, transparent)" />
        <h3 className={`${monoLabel} relative inline-block border border-white/70 px-2 py-1`}>{story.title}</h3>
        <dl className="relative mt-5 grid grid-cols-3 gap-3 md:gap-6">
          {story.claims.map((claim) => (
            <LabelBlock key={claim.label} tone="dark" label={<dt className="hidden normal-case md:block">{claim.detail}</dt>} className="gap-3!">
              <dd>
                <span className={`${headingBase} block text-[34px] leading-[0.9] sm:text-[64px] lg:text-[104px] lg:leading-[0.85]`}>
                  <Counter value={claim.value} />
                </span>
                <span className={`${cardTitle} mt-1 block text-[15px]! sm:text-[22px]! md:mt-2`}>{claim.label}</span>
              </dd>
            </LabelBlock>
          ))}
        </dl>
        <p className="relative mt-4 text-right font-mono text-[11px] tracking-[-0.02em] text-white/80 md:mt-5 md:text-xs">{story.compared}</p>
      </div>
      {story.views && clip.second ? (
        <BenchmarkFilms title={story.title} views={story.views} clips={[clip, clip.second]} tone={clip.tone} />
      ) : (
        <VideoFigure src={clip.src} poster={clip.poster} label={story.clipLabel} tone={clip.tone} chip={story.clip} className="border-t-0" />
      )}
      <FadeUp as="div" stagger={0.08} className="mt-3 hidden gap-3 lg:grid lg:grid-cols-3">
        {chartMeta.metrics[story.key].map((metric) => (
          <BarChart key={metric} rows={story.rows} labels={metricLabels(story, metric)} model={story.key} metric={metric} tag={story.tag} />
        ))}
      </FadeUp>
      <div className="mt-3">
        <BenchmarkChartTabs story={story} />
      </div>
    </article>
  );
}

export function Sky001Results() {
  const { moment } = sky001;
  return (
    <Section id="results">
      <SectionTitle size="md" align="left" note={moment.eyebrow}>
        {moment.before}
        {moment.emphasis}
        {moment.after}
      </SectionTitle>
      <FadeUp>
        <LabelBlock label={moment.versus} className="mt-10 max-w-[560px]">
          <p className={bodyText}>{moment.body}</p>
        </LabelBlock>
      </FadeUp>
      <div className="mt-12 flex flex-col gap-16 md:gap-20 lg:mt-16 lg:gap-24">
        {results.models.map((story) => (
          <BenchmarkStory key={story.key} story={story} clip={benchmarkMedia[story.key]} />
        ))}
      </div>
    </Section>
  );
}
