import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 10
  size?: number; // pixel width/height
  strokeWidth?: number;
  className?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  className = ''
}) => {
  // Clamp score between 0 and 10
  const normalizedScore = Math.max(0, Math.min(10, score));
  const percentage = (normalizedScore / 10) * 100;
  
  // SVG Math
  const radius = (size - strokeWidth - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  // Determine color matching SOC severity rules
  const getColor = () => {
    if (score >= 9.0) return '#EF4444'; // Critical - Red
    if (score >= 7.0) return '#F97316'; // High - Orange
    if (score >= 4.0) return '#FACC15'; // Medium - Yellow
    return '#22C55E'; // Low - Green
  };

  const getGradientId = () => {
    if (score >= 7.0) return 'riskGradientHigh';
    return 'riskGradientLow';
  };

  const getRiskLabel = () => {
    if (score >= 9.0) return 'CRITICAL';
    if (score >= 7.0) return 'HIGH';
    if (score >= 4.0) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Progress Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="riskGradientLow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
            <linearGradient id="riskGradientHigh" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="stroke-soc-card"
            strokeWidth={strokeWidth}
            fill="transparent"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
          />

          {/* Active progress circle with gradient */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{ filter: score >= 7.0 ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.3))' : 'none' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {normalizedScore.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase mt-0.5" style={{ color: getColor() }}>
            {getRiskLabel()}
          </span>
        </div>
      </div>
      
      <div className="mt-2.5 text-[11px] text-soc-muted font-medium tracking-wide">Risk Score Indicator</div>
    </div>
  );
};

export default RiskGauge;
