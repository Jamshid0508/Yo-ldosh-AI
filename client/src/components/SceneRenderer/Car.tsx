import { motion } from "framer-motion";
import type { Manevr } from "../../types";
import { arrowForManevr } from "./geometry";

interface Props {
  x: number;
  y: number;
  rotation: number;
  harf: string;
  rang: string;
  manevr: Manevr;
  meniki: boolean;
}

export default function Car({ x, y, rotation, harf, rang, manevr, meniki }: Props) {
  const arrowRotation = rotation + arrowForManevr(manevr);

  return (
    <g transform={`translate(${x} ${y})`}>
      {meniki && (
        <motion.circle
          r={22}
          fill="none"
          stroke="var(--marking, #ffc61e)"
          strokeWidth={3}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}

      {manevr !== "toxtagan" && (
        <g transform={`rotate(${arrowRotation})`} opacity={0.85}>
          <path d="M 0 -46 L -6 -34 L -2 -34 L -2 -26 L 2 -26 L 2 -34 L 6 -34 Z" fill="#1b1e24" />
        </g>
      )}

      <g transform={`rotate(${rotation})`}>
        <rect x={-11} y={-17} width={22} height={34} rx={5} fill={rang} stroke="#1b1e24" strokeWidth={1.2} />
        <rect x={-7} y={-12} width={14} height={9} rx={2} fill="#dfeaf5" opacity={0.9} />
        <text
          x={0}
          y={7}
          textAnchor="middle"
          fontSize={11}
          fontWeight={800}
          fill="#fff"
          transform={`rotate(${-rotation})`}
        >
          {harf}
        </text>
      </g>
    </g>
  );
}
