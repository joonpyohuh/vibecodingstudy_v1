import { useEffect, useRef, useState } from 'react';
import './WhyLearn.css';

const reasons = [
  {
    num: '01',
    icon: '🚀',
    title: '아이디어를 즉시 현실로',
    desc: '머릿속에 있는 서비스 아이디어를 당일에 프로토타입으로 만들 수 있습니다. 기획자, 디자이너, 마케터도 자신만의 도구를 직접 만드는 시대입니다.',
    highlight: '아이디어 → 프로덕트까지 단 몇 시간',
    color: '#6c63ff',
  },
  {
    num: '02',
    icon: '💼',
    title: '취업 시장에서의 경쟁력',
    desc: '개발자 채용 공고에 "AI 협업 경험" 요구가 폭발적으로 증가 중입니다. 바이브코딩은 선택이 아닌 필수 역량이 되어가고 있습니다.',
    highlight: '2025년 기준, AI 활용 개발자 연봉 30% 이상 우대',
    color: '#ff6584',
  },
  {
    num: '03',
    icon: '⏱️',
    title: '10배 빠른 생산성',
    desc: '보일러플레이트 코드, 반복 작업, 버그 디버깅 — AI가 대부분을 처리합니다. 인간 개발자는 진짜 창의적인 문제에 집중할 수 있습니다.',
    highlight: '같은 시간에 10배 더 많은 기능 구현',
    color: '#43e97b',
  },
  {
    num: '04',
    icon: '🌐',
    title: '비개발자도 할 수 있다',
    desc: '코딩 지식이 없어도 됩니다. 자신의 도메인 지식 + 바이브코딩 스킬 = 해당 분야 최강의 개발자입니다. 의료, 교육, 금융 모든 분야에서 혁신 가능합니다.',
    highlight: '도메인 전문가 + AI = 최강의 조합',
    color: '#f7971e',
  },
];

const stats = [
  { value: '75%', label: '개발자들이 AI 코딩 도구 사용 중', icon: '👩‍💻' },
  { value: '40%', label: '코드 작성 속도 향상 (GitHub 조사)', icon: '⚡' },
  { value: '$200B', label: '2030년 AI 개발 도구 시장 규모', icon: '💰' },
];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

export default function WhyLearn() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section id="why" className="why-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-header ${inView ? 'animate-fade-up' : ''}`}>
          <div className="section-tag">WHY LEARN?</div>
          <h2 className="section-title">
            왜 지금 <span className="gradient-text">바이브코딩을</span> 배워야 하나?
          </h2>
          <p className="section-subtitle">
            단순한 트렌드가 아닙니다. 이미 업계의 게임 체인저가 된 기술입니다.
          </p>
        </div>

        {/* Stats bar */}
        <div className={`stats-bar ${inView ? 'animate-fade-up delay-2' : ''}`}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card glass">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value gradient-text">{s.value}</span>
              <span className="stat-desc">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div className="reasons-list">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`reason-item ${inView ? (i % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right') : ''}`}
              style={{ animationDelay: `${0.3 + i * 0.2}s` }}
            >
              <div className="reason-num" style={{ color: r.color }}>{r.num}</div>
              <div className="reason-body glass">
                <div className="reason-header">
                  <span className="reason-icon" style={{ background: `${r.color}22` }}>{r.icon}</span>
                  <h3 className="reason-title" style={{ color: r.color }}>{r.title}</h3>
                </div>
                <p className="reason-desc">{r.desc}</p>
                <div className="reason-highlight" style={{ borderColor: r.color, background: `${r.color}11` }}>
                  <span className="highlight-star" style={{ color: r.color }}>★</span>
                  {r.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
