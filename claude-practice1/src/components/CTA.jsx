import { useRef, useState, useEffect } from 'react';
import './CTA.css';

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

const floatingEmojis = ['⚡', '🤖', '🚀', '💡', '🎯', '✨', '🔥', '💻', '🌟', '🎨'];

export default function CTA({ onLearn, onGrowth }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section id="cta" className="cta-section" ref={sectionRef}>
      <div className="cta-bg">
        {floatingEmojis.map((e, i) => (
          <div
            key={i}
            className="floating-emoji"
            style={{
              left: `${5 + i * 9}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
              fontSize: `${18 + (i % 3) * 8}px`,
            }}
          >
            {e}
          </div>
        ))}
        <div className="cta-glow-1" />
        <div className="cta-glow-2" />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={`cta-content ${inView ? 'animate-fade-up' : ''}`}>
          <div className="cta-badge">
            <span className="badge-pulse" />
            지금 바로 시작하세요
          </div>

          <h2 className="cta-title">
            <span className="gradient-text">AI와 함께</span> 만드는<br />
            당신만의 <span className="gradient-text">디지털 세계</span>
          </h2>

          <p className="cta-desc">
            코드를 배우는 게 두렵다면, 바이브코딩으로 시작하세요.<br />
            아이디어만 있으면 됩니다. AI가 나머지를 해결해 드립니다.
          </p>

          {/* 팀 프로젝트 하이라이트 */}
          <div className={`cta-team-highlight ${inView ? 'animate-fade-up delay-3' : ''}`}>
            <div className="cta-team-week">
              <span className="cta-team-week-label">Week 2</span>
              <span className="cta-team-week-tag">MAIN</span>
            </div>
            <div className="cta-team-info">
              <span className="cta-team-title">팀 프로젝트</span>
              <span className="cta-team-desc">6명이 팀을 이뤄 실제 프로덕트를 만듭니다</span>
            </div>
          </div>

          <div className={`cta-checklist ${inView ? 'animate-fade-up delay-4' : ''}`}>
            {[
              '🚀 Week 2부터 팀 프로젝트',
              '💻 실제 프로덕트 제작',
              '🤖 AI 도구 완전 정복',
              '✨ 6명이 함께 성장',
            ].map((item, i) => (
              <div key={i} className="check-item">{item}</div>
            ))}
          </div>

          <div className={`cta-actions ${inView ? 'animate-bounce-in delay-5' : ''}`}>
            <button className="cta-btn-primary" onClick={onLearn}>
              <span>학습하기</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="cta-btn-primary" onClick={onGrowth} style={{ background: 'linear-gradient(135deg, #00c060, #10b981)' }}>
              <span>📈 성장 현황 보기</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="cta-btn-secondary" onClick={() => document.querySelector('#what')?.scrollIntoView({ behavior: 'smooth' })}>
              처음부터 다시 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
