import { SiteFooter } from "@/components/skyfall/chrome/site-footer";
import { SiteNav } from "@/components/skyfall/chrome/site-nav";
import { Backers } from "./backers";
import { Build } from "./build";
import { Hero } from "./hero";
import { Matters } from "./matters";
import { Mission } from "./mission";
import { Pareto } from "./pareto";
import { Problem } from "./problem";
import { Team } from "./team";

export function HomePage() {
  return (
    <>
      <SiteNav page="home" />
      <main>
        <Hero />
        <Mission />
        <Problem />
        <Build />
        <Pareto />
        <Matters />
        <Team />
        <Backers />
      </main>
      <SiteFooter />
    </>
  );
}
