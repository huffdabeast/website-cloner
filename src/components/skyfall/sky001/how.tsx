import { container, gutter } from "@/lib/skyfall/classes";
import { StagesPlayer } from "./stages-player";

export function Sky001How() {
  return (
    <section id="how" aria-labelledby="how-title" className={`bg-studio ${gutter} py-16 md:py-24 lg:py-28`}>
      <div className={container}>
        <StagesPlayer titleId="how-title" />
      </div>
    </section>
  );
}
