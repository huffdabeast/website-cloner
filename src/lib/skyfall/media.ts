import type { ShowcaseId } from "@/content/skyfall";

export const asset = (path: string) => `/${path.replace(/^\//, "")}`;

export const launchVideoMedia = {
  src: asset("assets/media/launch-video.mp4"),
  poster: asset("assets/media/s-launch-video.jpg"),
};

export const benchmarkMedia = {
  cad: {
    src: asset("assets/media/cad-accuracy.mp4"),
    poster: asset("assets/media/s-cad-accuracy.jpg"),
    tone: "native-light",
    second: { src: asset("assets/media/cad-speed.mp4"), poster: asset("assets/media/s-cad-speed.jpg") },
  },
  bim: {
    src: asset("assets/media/bim-accuracy.mp4"),
    poster: asset("assets/media/s-bim-accuracy.jpg"),
    tone: "native-light",
    second: { src: asset("assets/media/bim-speed.mp4"), poster: asset("assets/media/s-bim-speed.jpg") },
  },
} as const;

export const stageMedia = {
  explore: { src: asset("assets/media/stage-explore.mp4"), poster: asset("assets/media/s-stage-explore.jpg") },
  decompose: { src: asset("assets/media/stage-decompose.mp4"), poster: asset("assets/media/s-stage-decompose.jpg") },
  sketch: { src: asset("assets/media/stage-sketch.mp4"), poster: asset("assets/media/s-stage-sketch.jpg") },
  construct: { src: asset("assets/media/stage-construct.mp4"), poster: asset("assets/media/s-stage-construct.jpg") },
} as const;

const showcaseFiles = (id: ShowcaseId) => ({
  reel: asset(`assets/showcase/reel/${id}.mp4`),
  poster: asset(`assets/showcase/seq/${id}_poster.webp`),
  final: asset(`assets/showcase/seq/${id}_final.webp`),
  input: asset(`assets/showcase/img/in_${id}.webp`),
});

export const showcaseMedia = {
  reel: (id: ShowcaseId) => showcaseFiles(id).reel,
  poster: (id: ShowcaseId) => showcaseFiles(id).poster,
  final: (id: ShowcaseId) => showcaseFiles(id).final,
  input: (id: ShowcaseId) => showcaseFiles(id).input,
};

export const logoMedia: Record<string, string> = {
  amii: asset("assets/logos/amii.png"),
  microsoft: asset("assets/logos/microsoft.png"),
  mila: asset("assets/logos/mila.svg"),
  "university-of-toronto": asset("assets/logos/university-of-toronto.png"),
  "vector-institute": asset("assets/logos/vector-institute.png"),
  ycombinator: asset("assets/logos/ycombinator.png"),
  fidelity: asset("assets/logos/investors/fidelity.png"),
  "inovia-capital": asset("assets/logos/investors/inovia-capital.png"),
  m13: asset("assets/logos/investors/m13.png"),
  "touring-capital": asset("assets/logos/investors/touring-capital.png"),
};

export const logoSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
