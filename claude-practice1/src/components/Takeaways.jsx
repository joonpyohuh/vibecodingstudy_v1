import { useRef, useState, useEffect } from 'react';
import './Takeaways.css';

const takeaways = [
  {
    icon: '🏗️',
    title: '실제 프로덕트 제작 경험',
    desc: '스터디 기간 동안 완성된 앱 또는 서비스를 직접 만들어봅니다. 포트폴리오에 바로 추가 가능한 실전 프로젝트입니다.',
    tags: ['포트폴리오', '실전', '완성도'],
    color: '#6c63ff',
    level: '핵심',
  },
  {
    icon: '🤖',
    title: 'AI 협업 능력',
    desc: 'ChatGPT, Claude, Cursor 등 주요 AI 도구들을 효과적으로 활용하는 방법을 체득합니다. 단순 사용이 아닌 전략적 활용법을 배웁니다.',
    tags: ['AI 도구', 'ChatGPT', 'Claude', 'Cursor'],
    color: '#ff6584',
    level: '필수',
  },
  {
    icon: '✍️',
    title: '프롬프트 작성 스킬',
    desc: '원하는 결과를 정확히 얻어내는 프롬프트 작성 패턴을 습득합니다. 이 스킬은 개발 외에도 업무 전반에 활용됩니다.',
    tags: ['프롬프트', '소통', '효율'],
    color: '#43e97b',
    level: '핵심',
  },
  {
    icon: '🧠',
    title: '개발자 사고방식',
    desc: '코딩 문법보다 중요한 것은 문제를 작게 쪼개고 논리적으로 해결하는 사고방식입니다. AI와 함께 개발하며 자연스럽게 체득합니다.',
    tags: ['문제 해결', '논리', '사고'],
    color: '#f7971e',
    level: '심화',
  },
  {
    icon: '🚀',
    title: '스타트업 마인드셋',
    desc: '아이디어를 빠르게 검증하고 실패에서 배우는 린 스타트업 방법론을 바이브코딩으로 체험합니다.',
    tags: ['린', '스타트업', '빠른 검증'],
    color: '#a78bfa',
    level: '보너스',
  },
  {
    icon: '🌐',
    title: '커뮤니티와 인맥',
    desc: '같은 관심사를 가진 스터디원들과의 네트워크는 평생 자산입니다. 함께 만든 프로젝트는 더 강력한 동기부여가 됩니다.',
    tags: ['네트워크', '협업', '성장'],
    color: '#34d399',
  },
];

const roadmap = [
  { week: 'Week 1', title: '바이브코딩 개요 & 환경 설정', icon: '🏁', desc: '도구 설치, 기본 개념 이해' },
  { week: 'Week 2', title: '프롬프트 엔지니어링 실습', icon: '✍️', desc: '실전 프롬프트 작성 & 패턴' },
  { week: 'Week 3', title: '미니 프로젝트 1', icon: '⚡', desc: '랜딩페이지 / 간단한 앱' },
  { week: 'Week 4', title: '고급 AI 활용법', icon: '🤖', desc: 'Multi-agent, Context 관리' },
  { week: 'Week 5', title: '팀 프로젝트 시작', icon: '👥', desc: '아이디어 기획 & 역할 분담' },
  { week: 'Week 6', title: '데모데이 & 회고', icon: '🎉', desc: '완성 프로젝트 발표 & 피드백' },
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

export default function Takeaways() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section id="takeaways" className="takeaways-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-header ${inView ? 'animate-fade-up' : ''}`}>
          <div className="section-tag" style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)' }}>
            WHAT YOU&apos;LL GAIN
          </div>
          <h2 className="section-title">
            스터디에서<br />
            <span className="gradient-text">얻어가는 것들</span>
          </h2>
          <p className="section-subtitle">
            단순히 기술을 배우는 게 아닙니다. <strong>사고방식과 실전 경험</strong>이 함께 성장합니다.
          </p>
        </div>

        <div className="takeaways-grid">
          {takeaways.map((t, i) => (
            <div
              key={i}
              className={`takeaway-card glass ${inView ? 'animate-scale-up' : ''}`}
              style={{
                animationDelay: `${0.1 + i * 0.12}s`,
                '--card-color': t.color,
              }}
            >
              {t.level && (
                <div className="card-badge" style={{ background: `${t.color}22`, color: t.color }}>
                  {t.level}
                </div>
              )}
              <div className="takeaway-icon" style={{ background: `${t.color}18` }}>
                {t.icon}
              </div>
              <h3 className="takeaway-title" style={{ color: t.color }}>{t.title}</h3>
              <p className="takeaway-desc">{t.desc}</p>
              <div className="takeaway-tags">
                {t.tags.map((tag, j) => (
                  <span key={j} className="tag" style={{ borderColor: `${t.color}40`, color: t.color }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-glow" style={{ background: t.color }} />
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div className={`roadmap ${inView ? 'animate-fade-up delay-6' : ''}`}>
          <h3 className="roadmap-title">📍 스터디 로드맵</h3>
          <div className="roadmap-track">
            {roadmap.map((r, i) => (
              <div key={i} className="roadmap-item">
                <div className="roadmap-node">
                  <div className="node-icon">{r.icon}</div>
                  <div className="node-connector" />
                </div>
                <div className="roadmap-info glass">
                  <div className="roadmap-week">{r.week}</div>
                  <div className="roadmap-title-item">{r.title}</div>
                  <div className="roadmap-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
