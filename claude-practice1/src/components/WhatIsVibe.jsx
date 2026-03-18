import { useEffect, useRef, useState } from 'react';
import './WhatIsVibe.css';

const features = [
  {
    icon: '🗣️',
    title: '자연어로 개발',
    desc: '코드 대신 말로 지시. "회원가입 폼 만들어줘"라고 하면 AI가 알아서 만들어 줍니다.',
    color: '#6c63ff',
  },
  {
    icon: '⚡',
    title: '즉각적인 결과',
    desc: '몇 달 걸리던 개발을 몇 시간, 심지어 몇 분 만에 완성할 수 있습니다.',
    color: '#ff6584',
  },
  {
    icon: '🔄',
    title: '반복적 개선',
    desc: '마음에 안 들면 다시 말하면 됩니다. AI와 대화하며 점점 완성해 나갑니다.',
    color: '#43e97b',
  },
  {
    icon: '🧠',
    title: '창의적 집중',
    desc: '코드 문법이 아닌 아이디어와 창의성에 집중할 수 있습니다.',
    color: '#f7971e',
  },
];

const tools = [
  { name: 'Claude Code', icon: '🤖', category: 'AI 코딩 어시스턴트' },
  { name: 'Cursor', icon: '🎯', category: 'AI 코드 에디터' },
  { name: 'Bolt.new', icon: '⚡', category: '브라우저 기반 개발' },
  { name: 'Lovable', icon: '💜', category: '풀스택 앱 생성' },
  { name: 'v0.dev', icon: '🎨', category: 'UI 컴포넌트 생성' },
  { name: 'Replit AI', icon: '🔧', category: '클라우드 코딩' },
];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

export default function WhatIsVibe() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section id="what" className="what-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-header ${inView ? 'animate-fade-up' : ''}`}>
          <div className="section-tag">WHAT IS VIBE CODING?</div>
          <h2 className="section-title">
            바이브코딩이란 <span className="gradient-text">무엇인가?</span>
          </h2>
          <p className="section-subtitle">
            2025년 AI 열풍과 함께 등장한 새로운 개발 패러다임.<br />
            <strong>Andrej Karpathy</strong>가 처음 언급한 개념으로, AI와 "바이브"를 맞추며 개발하는 방식입니다.
          </p>
        </div>

        <div className="quote-block glass">
          <div className="quote-icon">"</div>
          <p className="quote-text">
            코드를 이해하려고 하지 않고, 그냥 AI에게 원하는 걸 말하고, 에러가 나면 그것도 AI한테 붙여넣고...
            그렇게 <strong>바이브만으로 코딩하는 것</strong>
          </p>
          <div className="quote-author">— Andrej Karpathy, 2025</div>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card glass ${inView ? 'animate-scale-up' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              <div className="feature-icon" style={{ background: `${f.color}22`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-title" style={{ color: f.color }}>{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-bar" style={{ background: f.color }} />
            </div>
          ))}
        </div>

        <div className={`tools-section ${inView ? 'animate-fade-up delay-5' : ''}`}>
          <h3 className="tools-title">주요 바이브코딩 툴들</h3>
          <div className="tools-grid">
            {tools.map((t, i) => (
              <div key={i} className="tool-card" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                <span className="tool-icon">{t.icon}</span>
                <div>
                  <div className="tool-name">{t.name}</div>
                  <div className="tool-category">{t.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
