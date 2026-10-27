import React from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  percentageText,
  isPositive = true,
  badgeType = 'green', // 'green', 'red', 'blue', 'orange'
  sparklineColor = '#10B981',
  sparklineData = [12, 14, 13, 16, 15, 18, 17, 21],
  linkText = 'Ver detalles',
  onClickDetails,
}) {
  // Generar path SVG para la mini curva sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 240;
  const height = 40;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 10) - 5;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gradientId = `spark-grad-${title.replace(/\s+/g, '-').toLowerCase()}`;

  const badgeClass =
    badgeType === 'green'
      ? 'badge-green'
      : badgeType === 'red'
      ? 'badge-red'
      : badgeType === 'orange'
      ? 'badge-orange'
      : 'badge-blue';

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-title-label">{title}</span>
        <span className={`kpi-percentage-badge ${badgeClass}`}>
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          <span>{percentageText}</span>
        </span>
      </div>

      <div className="kpi-main-number">{value}</div>

      {/* Mini Sparkline Curve idéntica a la imagen */}
      <div className="kpi-sparkline-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradientId})`} />
          <path
            d={pathD}
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className="kpi-footer-link"
        onClick={onClickDetails}
      >
        <span>{linkText}</span>
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
