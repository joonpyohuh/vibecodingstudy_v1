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
            { num: '9명', label: 'B-CUBE 스터디원' },
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
