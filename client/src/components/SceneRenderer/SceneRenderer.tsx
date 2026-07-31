import { forwardRef } from "react";
import { signSvgUrl } from "../../lib/signAssets";
import type { Scene } from "../../types";
import Car from "./Car";
import { VIEWBOX, carPosition, pedestrianPosition, signPosition } from "./geometry";
import Pedestrian from "./Pedestrian";
import RoadBackground from "./RoadBackground";
import TrafficLight from "./TrafficLight";

interface Props {
  scene: Scene;
  className?: string;
}

const SceneRenderer = forwardRef<SVGSVGElement, Props>(function SceneRenderer(
  { scene, className = "" },
  ref
) {
  const laneCounters: Record<string, number> = {};
  const nextIndex = (key: string) => {
    laneCounters[key] = (laneCounters[key] ?? 0) + 1;
    return laneCounters[key] - 1;
  };

  return (
    <div className={`w-full bg-white ${className}`} data-testid="scene-renderer">
      <svg
        ref={ref}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="h-auto w-full"
        role="img"
        aria-label={scene.izoh}
      >
        <rect x={0} y={0} width={VIEWBOX} height={VIEWBOX} fill="#ffffff" />
        <RoadBackground yolTuri={scene.yol_turi} chizigi={scene.yol_boyi_chizigi} />

        {scene.belgilar.map((b, i) => {
          const idx = nextIndex(`sign-${b.tomon}`);
          const { x, y } = signPosition(b.tomon, idx);
          const url = signSvgUrl(b.belgi_id);
          return (
            <g key={i} transform={`translate(${x - 16} ${y - 16})`}>
              <rect width={32} height={32} rx={6} fill="#ffffff" stroke="#d5d8dd" strokeWidth={1} />
              {url ? (
                <image href={url} x={2} y={2} width={28} height={28} />
              ) : (
                <text x={16} y={20} textAnchor="middle" fontSize={9} fill="#c8362b">
                  {b.belgi_id}
                </text>
              )}
            </g>
          );
        })}

        {scene.piyodalar.map((p, i) => {
          const idx = nextIndex(`ped-${p.tomon}`);
          const { x, y } = pedestrianPosition(p.tomon, idx);
          return <Pedestrian key={i} x={x} y={y} harakat={p.harakat} />;
        })}

        {scene.mashinalar.map((m, i) => {
          const idx = nextIndex(`car-${m.tomon}`);
          const { x, y, rotation } = carPosition(m.tomon, idx);
          return (
            <Car
              key={i}
              x={x}
              y={y}
              rotation={rotation}
              harf={m.harf}
              rang={m.rang}
              manevr={m.manevr}
              meniki={m.meniki}
            />
          );
        })}

        {scene.svetofor && <TrafficLight rang={scene.svetofor} />}
      </svg>
      {scene.izoh && (
        <p className="border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500">{scene.izoh}</p>
      )}
    </div>
  );
});

export default SceneRenderer;
