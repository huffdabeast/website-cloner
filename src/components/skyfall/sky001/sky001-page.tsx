import { SiteFooter } from "@/components/skyfall/chrome/site-footer";
import { SiteNav } from "@/components/skyfall/chrome/site-nav";
import { Sky001Contrarian } from "./contrarian";
import { Sky001Faq } from "./faq";
import { Sky001Hero } from "./hero";
import { Sky001How } from "./how";
import { Sky001Intro } from "./intro";
import { Sky001Next } from "./next";
import { Sky001Results } from "./results";
import { Sky001Waitlist } from "./waitlist";

export function Sky001Page() {
  return (
    <>
      <SiteNav page="launch" />
      <main>
        <Sky001Hero />
        <Sky001Intro />
        <Sky001Contrarian />
        <Sky001Results />
        <Sky001How />
        <Sky001Next />
        <Sky001Faq />
        <Sky001Waitlist />
      </main>
      <SiteFooter />
    </>
  );
}
