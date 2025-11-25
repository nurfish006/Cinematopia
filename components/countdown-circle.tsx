interface CountdownCircleProps {
  progress: number
}

export default function CountdownCircle({ progress }: CountdownCircleProps) {
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="absolute top-6 right-6 w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-foreground/20"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-accent transition-all duration-100"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-center">
          <p className="text-lg font-bold text-accent">{Math.ceil((progress / 100) * 8)}s</p>
          <p className="text-[10px] text-foreground/60">Next</p>
        </span>
      </div>
    </div>
  )
}
