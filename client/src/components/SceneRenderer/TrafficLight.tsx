interface Props {
  rang: "qizil" | "sariq" | "yashil";
}

export default function TrafficLight({ rang }: Props) {
  const lights: Array<{ key: "qizil" | "sariq" | "yashil"; color: string }> = [
    { key: "qizil", color: "#c8362b" },
    { key: "sariq", color: "#ffc61e" },
    { key: "yashil", color: "#1f8a4e" },
  ];
  return (
    <g transform={`translate(${160} ${58})`}>
      <rect x={-10} y={-30} width={20} height={54} rx={5} fill="#1b1e24" />
      {lights.map((l, i) => (
        <circle
          key={l.key}
          cx={0}
          cy={-22 + i * 16}
          r={6}
          fill={l.color}
          opacity={rang === l.key ? 1 : 0.25}
        />
      ))}
    </g>
  );
}
