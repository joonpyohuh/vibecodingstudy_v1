import { useRef, useState, useEffect } from 'react';
import './ProsCons.css';

const pros = [
  { icon: '⚡', title: '폭발적인 개발 속도', desc: '몇 주 걸리던 작업을 몇 시간으로 단축. 프로토타입을 즉시 검증할 수 있습니다.' },
  { icon: '💡', title: '낮은 진입 장벽', desc: '코딩 문법을 몰라도 됩니다. 아이디어와 논리적 사고만 있으면 충분합니다.' },
  { icon: '🎨', title: '창의성 극대화', desc: '반복 작업은 AI에게 맡기고 사람은 창의적 문제 해결에만 집중할 수 있습니다.' },
  { icon: '🔄', title: '빠른 실험과 검증', desc: 'MVP를 빠르게 만들어 시장 반응을 확인하고 피벗이 쉬워집니다.' },
  { icon: '📚', title: '학습 가속화', desc: 'AI의 코드를 보며 새로운 기술 패턴을 빠르게 습득할 수 있습니다.' },
  { icon: '🌍', title: '비용 절감', desc: '소규모 팀으로 대규모 프로젝트를 처리할 수 있어 개발 비용이 크게 줄어듭니다.' },
];

const cons = [
  { icon: '🕳️', title: '블랙박스 코드 위험', desc: 'AI가 생성한 코드를 이해하지 못하면 나중에 수정이나 디버깅이 어렵습니다.' },
  { icon: '🔒', title: '보안 취약점 가능성', desc: 'AI가 보안을 완벽히 고려하지 못할 수 있어 민감한 시스템에선 반드시 검토 필요합니다.' },
  { icon: '📉', title: '기초 실력 저하 우려', desc: '지나치게 의존하면 근본적인 CS 지식이나 알고리즘 이해가 부족해질 수 있습니다.' },
  { icon: '🎯', title: 'AI 환각 현상', desc: '존재하지 않는 API나 잘못된 정보를 사실처럼 제시하는 경우가 있습니다.' },
  { icon: '💰', title: '비용 문제', desc: '고급 AI 모델은 비쌉니다. 대규모 프로젝트에서 API 비용이 예상보다 커질 수 있습니다.' },
  { icon: '⚖️', title: '저작권 및 윤리 이슈', desc: 'AI가 생성한 코드의 저작권, 개인정보 처리 방식에 대한 불확실성이 존재합니다.' },
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

export default function ProsCons() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const [activeTab, setActiveTab] = useState('both');

  return (
    <section id="pros-cons" className="procons-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-header ${inView ? 'animate-fade-up' : ''}`}>
          <div className="section-tag" style={{ color: '#f7971e', borderColor: 'rgba(247,151,30,0.3)' }}>
            PROS & CONS
          </div>
          <h2 className="section-title">
            솔직하게 말하는<br />
            <span className="gradient-text">장점과 단점</span>
          </h2>
          <p className="section-subtitle">
            바이브코딩을 맹목적으로 찬양하지 않습니다. 진짜 유용하게 쓰려면 <strong>한계도 알아야 합니다.</strong>
          </p>
        </div>

        <div className={`tab-switcher ${inView ? 'animate-fade-up delay-2' : ''}`}>
          {[
            { key: 'both', label: '전체 보기' },
            { key: 'pros', label: '✅ 장점' },
            { key: 'cons', label: '⚠️ 단점' },
          ].map(t => (
            <button
              key={t.key}
              className={`switcher-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="procons-grid">
          {(activeTab === 'both' || activeTab === 'pros') && (
            <div className={`pros-column ${inView ? 'animate-slide-left delay-3' : ''}`}>
              <div className="column-header pros-header">
                <span className="column-icon">✅</span>
                <h3>장점 (Pros)</h3>
                <div className="column-count">{pros.length}가지</div>
              </div>
              {pros.map((p, i) => (
                <div key={i} className="item-card pros-card glass">
                  <span className="item-icon">{p.icon}</span>
                  <div>
                    <div className="item-title">{p.title}</div>
                    <div className="item-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'both' || activeTab === 'cons') && (
            <div className={`cons-column ${inView ? 'animate-slide-right delay-3' : ''}`}>
              <div className="column-header cons-header">
                <span className="column-icon">⚠️</span>
                <h3>단점 (Cons)</h3>
                <div className="column-count">{cons.length}가지</div>
              </div>
              {cons.map((c, i) => (
                <div key={i} className="item-card cons-card glass">
                  <span className="item-icon">{c.icon}</span>
                  <div>
                    <div className="item-title">{c.title}</div>
                    <div className="item-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`verdict-box glass ${inView ? 'animate-fade-up delay-6' : ''}`}>
          <div className="verdict-icon">⚖️</div>
          <div className="verdict-content">
            <h3>결론: 올바른 활용법</h3>
            <p>
              바이브코딩은 만능이 아닙니다. 하지만 <strong>올바르게 사용하면 생산성 혁명</strong>을 경험할 수 있습니다.
              AI를 보조 도구로 활용하되, 코드를 이해하고 검증하는 습관을 함께 길러야 합니다.
              이 스터디에서 우리는 그 균형점을 찾을 것입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
