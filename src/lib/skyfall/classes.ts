export const gutter = "px-6 md:px-10";
export const container = "mx-auto w-full max-w-[1208px]";
export const monoLabel = "font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]";
export const heroTitle =
  "text-[46px] leading-[0.92] font-medium capitalize tracking-[-0.045em] text-balance sm:text-[84px] lg:text-[128px] lg:leading-[0.86]";
export const cardTitle = "text-[22px] leading-[1.15] font-medium tracking-[-0.05em] md:text-[26px]";
export const headingBase = "font-medium capitalize tracking-[-0.045em] text-balance";
export const bodyText = "text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]";
export const bodySmall = "text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base";

export const externalLinkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});
