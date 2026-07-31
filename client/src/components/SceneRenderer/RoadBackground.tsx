import type { YolTuri } from "../../types";
import { CENTER, ROAD_HALF, VIEWBOX } from "./geometry";

const ASPHALT = "#3a3f47";
const LANE_WHITE = "#ffffff";

interface Props {
  yolTuri: YolTuri;
  chizigi: "uzuq" | "yaxlit" | "yoq";
}

const lo = CENTER - ROAD_HALF;
const hi = CENTER + ROAD_HALF;

function CenterLine({
  x1,
  y1,
  x2,
  y2,
  chizigi,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  chizigi: Props["chizigi"];
}) {
  if (chizigi === "yoq") return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--marking, #ffc61e)"
      strokeWidth={3}
      strokeDasharray={chizigi === "uzuq" ? "10 8" : undefined}
    />
  );
}

function Crosswalk({ horizontal }: { horizontal: boolean }) {
  const stripes = Array.from({ length: 6 });
  return (
    <g>
      {stripes.map((_, i) => {
        const offset = lo + 6 + i * ((hi - lo - 12) / (stripes.length - 1));
        return horizontal ? (
          <rect key={i} x={CENTER - 14} y={offset - 3} width={28} height={6} fill={LANE_WHITE} />
        ) : (
          <rect key={i} x={offset - 3} y={CENTER - 14} width={6} height={28} fill={LANE_WHITE} />
        );
      })}
    </g>
  );
}

export default function RoadBackground({ yolTuri, chizigi }: Props) {
  const vertical = <rect x={lo} y={0} width={hi - lo} height={VIEWBOX} fill={ASPHALT} />;
  const horizontal = <rect x={0} y={lo} width={VIEWBOX} height={hi - lo} fill={ASPHALT} />;
  const vStub = (fromY: number) => (
    <rect x={lo} y={fromY} width={hi - lo} height={VIEWBOX} fill={ASPHALT} />
  );

  switch (yolTuri) {
    case "togri_yol":
      return (
        <g>
          {vertical}
          <CenterLine x1={CENTER} y1={0} x2={CENTER} y2={VIEWBOX} chizigi={chizigi} />
        </g>
      );

    case "piyoda_otish":
      return (
        <g>
          {vertical}
          <CenterLine x1={CENTER} y1={0} x2={CENTER} y2={lo - 2} chizigi={chizigi} />
          <CenterLine x1={CENTER} y1={hi + 2} x2={CENTER} y2={VIEWBOX} chizigi={chizigi} />
          <Crosswalk horizontal={false} />
        </g>
      );

    case "chorraha_4":
      return (
        <g>
          {vertical}
          {horizontal}
          <CenterLine x1={CENTER} y1={0} x2={CENTER} y2={lo} chizigi={chizigi} />
          <CenterLine x1={CENTER} y1={hi} x2={CENTER} y2={VIEWBOX} chizigi={chizigi} />
          <CenterLine x1={0} y1={CENTER} x2={lo} y2={CENTER} chizigi={chizigi} />
          <CenterLine x1={hi} y1={CENTER} x2={VIEWBOX} y2={CENTER} chizigi={chizigi} />
        </g>
      );

    case "chorraha_T":
      return (
        <g>
          {horizontal}
          {vStub(CENTER)}
          <CenterLine x1={0} y1={CENTER} x2={lo} y2={CENTER} chizigi={chizigi} />
          <CenterLine x1={hi} y1={CENTER} x2={VIEWBOX} y2={CENTER} chizigi={chizigi} />
          <CenterLine x1={CENTER} y1={hi} x2={CENTER} y2={VIEWBOX} chizigi={chizigi} />
        </g>
      );

    case "aylanma":
      return (
        <g>
          {vertical}
          {horizontal}
          <circle cx={CENTER} cy={CENTER} r={ROAD_HALF + 8} fill={ASPHALT} />
          <circle cx={CENTER} cy={CENTER} r={ROAD_HALF - 18} fill="#8fae86" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={ROAD_HALF + 8}
            fill="none"
            stroke={LANE_WHITE}
            strokeWidth={2}
            strokeDasharray="6 6"
          />
        </g>
      );

    case "hovli_chiqish":
      return (
        <g>
          {vertical}
          <CenterLine x1={CENTER} y1={0} x2={CENTER} y2={VIEWBOX} chizigi="yaxlit" />
          <rect x={0} y={CENTER - 22} width={lo} height={44} fill={ASPHALT} opacity={0.85} />
        </g>
      );

    default:
      return <g>{vertical}</g>;
  }
}
