import { useEffect, useRef } from 'react';
import ajouLogo from '../assets/ajou-logo.png';
import './Hero.css';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 4 + Math.random() * 8,
}));

const codeLines = [
  '> "앱 만들어줘"',
  '✓ Components generated...',
  '✓ API connected...',
  '✓ UI styled...',
  '🚀 배포 완료!',
];

export default function Hero() {
  const codeRef = useRef(null);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (!codeRef.current) return;
      const lines = codeRef.current.querySelectorAll('.code-line');
      lines.forEach(l => l.classList.remove('active'));
      if (lineIndex < lines.length) {
        lines[lineIndex].classList.add('active');
        lines[lineIndex].style.opacity = '1';
      }
      lineIndex = (lineIndex + 1) % lines.length;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Particles */}
      <div className="particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="hero-content">
        {/* 아주대 로고 배지 */}
        <div className="hero-ajou-row animate-bounce-in">
          <img src={ajouLogo} alt="아주대학교" className="hero-ajou-logo" />
          <span className="hero-ajou-label">아주대학교 경영인텔리전스학과 B-CUBE</span>
        </div>

        <h1 className="hero-title animate-fade-up delay-2">
          <span className="title-line">AI와 함께</span>
          <br />
          <span className="gradient-text title-big">느낌대로 코딩</span>
          <br />
          <span className="title-line">하는 시대가 왔다</span>
        </h1>

        <p className="hero-desc animate-fade-up delay-4">
          코드를 한 줄도 몰라도 괜찮아요. <strong>자연어로 대화하듯</strong> AI에게 원하는 것을 말하면,<br />
          완성된 앱이 눈앞에 나타납니다. 이것이 바이브코딩입니다.
        </p>

        {/* 팀 프로젝트 강조 카드 */}
        <div className="hero-team-card animate-fade-up delay-5">
          <div className="hero-team-card__left">
            <span className="hero-team-card__week">Week 2</span>
            <span className="hero-team-card__arrow">→</span>
          </div>
          <div className="hero-team-card__right">
            <span className="hero-team-card__title">팀 프로젝트 시작</span>
            <span className="hero-team-card__sub">아이디어를 실제 프로덕트로 만드는 시간</span>
          </div>
          <span className="hero-team-card__badge">MAIN</span>
        </div>

        <div className="hero-actions animate-fade-up delay-6">
          <a href="#what" className="btn-primary" onClick={e => { e.preventDefault(); document.querySelector('#what')?.scrollIntoView({ behavior: 'smooth' }); }}>
            지금 시작하기 🚀
          </a>
          <a href="#why" className="btn-secondary" onClick={e => { e.preventDefault(); document.querySelector('#why')?.scrollIntoView({ behavior: 'smooth' }); }}>
            더 알아보기 →
          </a>
        </div>

        <div className="hero-stats animate-fade-up delay-7">
          {[
            { num: '6명', label: 'B-CUBE 스터디원' },
            { num: 'W2', label: '팀 프로젝트 시작' },
            { num: '∞', label: '가능성의 확장' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-num gradient-text">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 귀여운 고양이 */}
      <div className="hero-cat animate-slide-right delay-3" aria-hidden="true">
        <svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" className="hero-cat-svg">
          {/* 꼬리 */}
          <path d="M88 90 Q110 70 105 50 Q100 35 90 45 Q95 60 85 80 Z" fill="#c0a0f0" />
          {/* 몸통 */}
          <ellipse cx="60" cy="82" rx="36" ry="24" fill="#d8b4fe" />
          {/* 배 (밝은 부분) */}
          <ellipse cx="60" cy="84" rx="20" ry="16" fill="#f3e8ff" />
          {/* 머리 */}
          <circle cx="60" cy="52" r="26" fill="#d8b4fe" />
          {/* 귀 왼쪽 */}
          <polygon points="38,34 30,14 50,28" fill="#d8b4fe" />
          <polygon points="40,32 34,18 48,28" fill="#f9a8d4" />
          {/* 귀 오른쪽 */}
          <polygon points="82,34 90,14 70,28" fill="#d8b4fe" />
          <polygon points="80,32 86,18 72,28" fill="#f9a8d4" />
          {/* 눈 왼쪽 */}
          <ellipse cx="50" cy="52" rx="5" ry="6" fill="#1d1d1f" />
          <circle cx="52" cy="50" r="1.8" fill="white" />
          {/* 눈 오른쪽 */}
          <ellipse cx="70" cy="52" rx="5" ry="6" fill="#1d1d1f" />
          <circle cx="72" cy="50" r="1.8" fill="white" />
          {/* 코 */}
          <polygon points="60,59 57,63 63,63" fill="#f472b6" />
          {/* 입 */}
          <path d="M57,63 Q60,67 63,63" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
          {/* 수염 왼쪽 */}
          <line x1="36" y1="61" x2="54" y2="63" stroke="#9333ea" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <line x1="35" y1="65" x2="54" y2="65" stroke="#9333ea" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* 수염 오른쪽 */}
          <line x1="84" y1="61" x2="66" y2="63" stroke="#9333ea" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <line x1="85" y1="65" x2="66" y2="65" stroke="#9333ea" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* 앞발 왼쪽 */}
          <ellipse cx="44" cy="102" rx="10" ry="7" fill="#c4b5fd" />
          {/* 앞발 오른쪽 */}
          <ellipse cx="76" cy="102" rx="10" ry="7" fill="#c4b5fd" />
          {/* 발가락 선 */}
          <line x1="40" y1="103" x2="40" y2="107" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="44" y1="104" x2="44" y2="108" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="48" y1="103" x2="48" y2="107" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="72" y1="103" x2="72" y2="107" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="76" y1="104" x2="76" y2="108" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="80" y1="103" x2="80" y2="107" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div className="hero-cat-bubble">AI랑 같이 코딩중 🐾</div>
      </div>

      {/* Code terminal */}
      <div className="hero-terminal animate-slide-right delay-4">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">vibe-code.ai</span>
        </div>
        <div className="terminal-body" ref={codeRef}>
          {codeLines.map((line, i) => (
            <div key={i} className="code-line" style={{ opacity: 0 }}>
              <span className="line-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="line-text">{line}</span>
            </div>
          ))}
        </div>
        <div className="terminal-cursor" />
      </div>

      <div className="scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>스크롤해서 탐험하기</span>
      </div>
    </section>
  );
}
