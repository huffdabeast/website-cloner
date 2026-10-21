import { home } from "@/content/skyfall";

const INK = "#1a1a1a";
const DASH = "#c4c4c4";
const BLUE = "#3e57da";

const point = (index: number, radius: number): [number, number] => {
  const angle = (index / 3) * Math.PI * 2 - Math.PI / 2;
  return [240 + Math.cos(angle) * radius, 215 + Math.sin(angle) * radius];
};

const triangle = (radius: number) => [0, 1, 2].map((index) => point(index, radius).join(",")).join(" ");

export function ParetoChart() {
  return (
    <svg
      viewBox="0 0 480 400"
      role="img"
      aria-label={`Three axes, ${home.pareto.axes.join(", ")}, with a frontier that extends on all three at once.`}
      className="w-full"
    >
      {[60, 110, 160].map((radius) => (
        <polygon key={radius} points={triangle(radius)} fill="none" stroke="#e0e0e0" />
      ))}
      {[0, 1, 2].map((index) => {
        const [x, y] = point(index, 160);
        return <path key={index} d={`M240 215L${x} ${y}`} stroke="#e0e0e0" />;
      })}
      <polygon points={triangle(80)} fill="none" stroke={DASH} strokeWidth="1.5" strokeDasharray="5 5" />
      <polygon points={triangle(160)} fill={BLUE} fillOpacity="0.08" stroke={BLUE} strokeWidth="2" />
      {home.pareto.axes.map((axis, index) => {
        const [cx, cy] = point(index, 160);
        const [x, y] = point(index, 188);
        return (
          <g key={axis}>
            <circle cx={cx} cy={cy} r="6" fill={BLUE} />
            <text x={x} y={y + 4} textAnchor="middle" fill={INK} className="font-sans text-[15px] font-medium">
              {axis}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
