import { sky001 } from "@/content/skyfall";
import { bodyText } from "@/lib/skyfall/classes";
import { Section, SectionTitle } from "@/components/skyfall/ui/layout";

const EMAIL = /([\w.%+-]+@[\w-]+(?:\.[\w-]+)+)/;

function linkEmails(text: string) {
  return text.split(EMAIL).map((part, index) =>
    index % 2 ? (
      <a
        key={index}
        href={`mailto:${part}`}
        className="text-white underline decoration-white/40 underline-offset-4 transition-colors duration-300 hover:text-brand-lift hover:decoration-current"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function Sky001Faq() {
  const { faq } = sky001;
  return (
    <Section id="faq" ground="ink">
      <SectionTitle tone="dark" size="md">
        {faq.title}
      </SectionTitle>
      <div className="mx-auto mt-10 max-w-[860px] border-t border-night-mid lg:mt-14">
        {faq.items.map((item) => (
          <details key={item.q} className="group border-b border-night-mid">
            <summary className="flex min-h-14 cursor-pointer items-center gap-4 py-3 font-mono text-[13px] tracking-[0.03em] group-open:text-brand-lift md:text-sm">
              <span className="flex-1">{item.q}</span>
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center bg-white text-ink transition-colors duration-300 group-open:bg-brand group-open:text-white"
              >
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="transition-transform duration-300 group-open:rotate-45"
                >
                  <path d="M6 1v10M1 6h10" />
                </svg>
              </span>
            </summary>
            {item.a && <p className={`${bodyText} max-w-[60ch] pb-5 text-white/85`}>{linkEmails(item.a)}</p>}
          </details>
        ))}
      </div>
    </Section>
  );
}
