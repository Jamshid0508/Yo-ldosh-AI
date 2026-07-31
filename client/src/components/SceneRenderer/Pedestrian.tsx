import { motion } from "framer-motion";

interface Props {
  x: number;
  y: number;
  harakat: "otmoqda" | "kutmoqda";
}

export default function Pedestrian({ x, y, harakat }: Props) {
  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      animate={harakat === "otmoqda" ? { y: [y - 2, y + 2, y - 2] } : {}}
      transition={{ duration: 0.9, repeat: Infinity }}
    >
      <circle cx={0} cy={-9} r={4} fill="#1b1e24" />
      <rect x={-3} y={-5} width={6} height={10} rx={2} fill="#c8362b" />
      <line x1={-3} y1={5} x2={-5} y2={13} stroke="#1b1e24" strokeWidth={2} strokeLinecap="round" />
      <line x1={3} y1={5} x2={5} y2={13} stroke="#1b1e24" strokeWidth={2} strokeLinecap="round" />
      {harakat === "kutmoqda" && (
        <circle cx={0} cy={-9} r={13} fill="none" stroke="#c8362b" strokeWidth={1.5} strokeDasharray="3 3" />
      )}
    </motion.g>
  );
}
