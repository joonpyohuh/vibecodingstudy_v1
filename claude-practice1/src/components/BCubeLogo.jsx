import { useId } from 'react';

/**
 * BCubeLogo — B-CUBE 공식 로고 SVG
 * useId()로 gradient ID 충돌 완전 방지
 */
export default function BCubeLogo({ size = 80, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const idBg   = `bc-bg-${uid}`;
  const idLeft = `bc-lf-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 */}
      <rect width="100" height="100" rx="20" fill="#080E26"/>
      <rect width="100" height="100" rx="20" fill={`url(#${idBg})`} opacity="0.6"/>

      {/* ── 상단 면 (밝은 그린) ── */}
      <polygon points="50,10 86,30 50,50 14,30" fill="#00C85A"/>
      {/* 상단 내부 어두운 테두리 강조 */}
      <polygon points="50,15 82,33 50,47 18,33" fill="none"
        stroke="rgba(0,80,30,0.3)" strokeWidth="1.2"/>

      {/* ── 좌측 면 (다크 틸) ── */}
      <polygon points="14,30 50,50 50,90 14,70" fill="#0B6040"/>
      <polygon points="14,30 50,50 50,90 14,70"
        fill={`url(#${idLeft})`} opacity="0.4"/>

      {/* ── 우측 면 (거의 블랙) ── */}
      <polygon points="50,50 86,30 86,70 50,90" fill="#060E24"/>

      {/* ── 레드 도트 ── */}
      <circle cx="72" cy="56" r="5.5" fill="#E63B3B"/>
      <circle cx="70.5" cy="54.5" r="2.2" fill="rgba(255,255,255,0.28)"/>

      {/* ── 엣지 라인 ── */}
      <line x1="50" y1="10"  x2="50" y2="50" stroke="rgba(0,0,0,0.20)" strokeWidth="0.7"/>
      <line x1="14" y1="30"  x2="14" y2="70" stroke="rgba(0,0,0,0.18)" strokeWidth="0.7"/>
      <line x1="86" y1="30"  x2="86" y2="70" stroke="rgba(0,0,0,0.18)" strokeWidth="0.7"/>
      <line x1="50" y1="50"  x2="50" y2="90" stroke="rgba(0,0,0,0.16)" strokeWidth="0.7"/>

      <defs>
        <linearGradient id={idBg} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1a2560"/>
          <stop offset="100%" stopColor="#040812"/>
        </linearGradient>
        <linearGradient id={idLeft} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000000"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
