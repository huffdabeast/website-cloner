import type { AnchorHTMLAttributes, ReactNode } from "react";
import { externalLinkProps } from "@/lib/skyfall/classes";

interface SiteLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
}

// Pages are full document loads, as on skyfall.ai: the blog embed scripts bind to the DOM once per load.
export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  return (
    <a href={href} {...externalLinkProps(href)} {...props}>
      {children}
    </a>
  );
}
