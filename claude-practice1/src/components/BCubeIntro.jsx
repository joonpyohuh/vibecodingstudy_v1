import { useState, useEffect } from 'react';
import './BCubeIntro.css';

export default function BCubeIntro({ onDone }) {
  const [phase, setPhase] = useState('build'); // build → show → out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('out'), 2700);
    const t3 = setTimeout(onDone, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`intro-wrap ${phase === 'out' ? 'intro-wrap--out' : ''}`}>
      {/* 배경 노이즈 그라디언트 */}
      <div className="intro-bg" />

      <div className="intro-stage">
        {/* ── 큐브 SVG ── */}
        <div className={`intro-cube-wrap ${phase !== 'build' ? 'intro-cube-wrap--in' : ''}`}>
          <svg
            viewBox="0 0 100 100"
            width="140"
            height="140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="intro-svg"
          >
            {/* 배경 rect */}
            <rect width="100" height="100" rx="20" fill="#080D24" className="intro-rect" />
            <rect width="100" height="100" rx="20" fill="url(#iBg)" opacity="0.5" />

            {/* 상단 면 */}
            <polygon
              points="50,13 84,31 50,49 16,31"
              fill="#00C85A"
              className="intro-face intro-face--top"
            />
            <polygon
              points="50,17 80,33 50,45 20,33"
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
              className="intro-face intro-face--top"
            />

            {/* 좌측 면 */}
            <polygon
              points="16,31 50,49 50,87 16,69"
              fill="#0B6646"
              className="intro-face intro-face--left"
            />
            <polygon
              points="16,31 50,49 50,87 16,69"
              fill="url(#iLeft)"
              opacity="0.35"
              className="intro-face intro-face--left"
            />

            {/* 우측 면 */}
            <polygon
              points="50,49 84,31 84,69 50,87"
              fill="#07102B"
              className="intro-face intro-face--right"
            />

            {/* 레드 도트 */}
            <circle cx="71" cy="55" r="5.5" fill="#E63B3B" className="intro-face intro-face--dot" />
            <circle cx="69.5" cy="53.5" r="2" fill="rgba(255,255,255,0.25)" className="intro-face intro-face--dot" />

            {/* 엣지 */}
            <line x1="50" y1="13" x2="50" y2="49" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" className="intro-face intro-face--top" />
            <line x1="16" y1="31" x2="16" y2="69" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" className="intro-face intro-face--left" />
            <line x1="84" y1="31" x2="84" y2="69" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" className="intro-face intro-face--right" />
            <line x1="50" y1="49" x2="50" y2="87" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" className="intro-face intro-face--right" />

            <defs>
              <linearGradient id="iBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a2060" />
                <stop offset="100%" stopColor="#050818" />
              </linearGradient>
              <linearGradient id="iLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>

          {/* 큐브 아래 글로우 */}
          <div className="intro-glow" />
        </div>

        {/* ── 텍스트 ── */}
        <div className={`intro-text-wrap ${phase !== 'build' ? 'intro-text-wrap--in' : ''}`}>
          <div className="intro-brand">B-CUBE</div>
          <div className="intro-sub">아주대학교 경영인텔리전스학과 소학회</div>
        </div>

        {/* ── 로딩 바 ── */}
        <div className={`intro-bar-wrap ${phase !== 'build' ? 'intro-bar-wrap--in' : ''}`}>
          <div className="intro-bar" />
        </div>
      </div>
    </div>
  );
}
