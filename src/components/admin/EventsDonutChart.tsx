interface EventsDonutChartProps {
  upcoming: number;
  past: number;
  upcomingLabel: string;
  pastLabel: string;
}

export function EventsDonutChart({
  upcoming,
  past,
  upcomingLabel,
  pastLabel,
}: EventsDonutChartProps) {
  const total = upcoming + past;
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const upcomingRatio = total > 0 ? upcoming / total : 0;
  const upcomingLength = circumference * upcomingRatio;

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="relative shrink-0">
        <svg width={150} height={150} viewBox="0 0 150 150" className="-rotate-90">
          <circle
            cx={75}
            cy={75}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {total > 0 && (
            <circle
              cx={75}
              cy={75}
              r={radius}
              fill="none"
              stroke="#8b2fd6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${upcomingLength} ${circumference - upcomingLength}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{total}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
          <span className="text-white/70">
            {upcomingLabel}: <span className="font-bold text-white">{upcoming}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/15" />
          <span className="text-white/70">
            {pastLabel}: <span className="font-bold text-white">{past}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
