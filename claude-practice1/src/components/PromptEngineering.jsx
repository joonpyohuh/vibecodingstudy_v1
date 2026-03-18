import { useRef, useState, useEffect } from 'react';
import './PromptEngineering.css';

const levels = [
  {
    level: 'LV 1',
    title: '기본 요청',
    bad: '로그인 만들어줘',
    good: '이메일과 비밀번호로 로그인하는 폼을 만들어줘. 유효성 검사 포함하고 오류 메시지도 한국어로 보여줘.',
    tip: '구체적으로 명시할수록 AI가 원하는 결과를 냅니다.',
    color: '#6c63ff',
  },
  {
    level: 'LV 2',
    title: '컨텍스트 제공',
    bad: '함수 고쳐줘',
    good: 'Next.js 14 App Router 기반 프로젝트야. 이 API 함수가 500 에러를 던지는데, 에러 핸들링 추가하고 TypeScript 타입도 맞춰줘.',
    tip: '기술 스택, 현재 상황, 원하는 결과를 함께 제공하세요.',
    color: '#ff6584',
  },
  {
    level: 'LV 3',
    title: '역할 부여',
    bad: '이 코드 리뷰해줘',
    good: '시니어 풀스택 개발자 관점에서 이 코드를 리뷰해줘. 보안 취약점, 성능 이슈, 코드 가독성 순서로 피드백 주고 각각 수정 예시도 보여줘.',
    tip: 'AI에게 구체적인 역할을 부여하면 전문성이 올라갑니다.',
    color: '#43e97b',
  },
  {
    level: 'LV 4',
    title: '단계적 분해',
    bad: '쇼핑몰 만들어줘',
    good: '쇼핑몰을 만들거야. 1단계: 상품 목록 컴포넌트, 2단계: 장바구니 상태관리, 3단계: 결제 플로우 순서로 각 단계마다 완성 후 진행할게.',
    tip: '복잡한 요청은 작은 단계로 나눠서 요청하세요.',
    color: '#f7971e',
  },
];

const principles = [
  { icon: '🎯', title: '명확성', desc: '모호한 표현 대신 구체적인 요구사항' },
  { icon: '📋', title: '컨텍스트', desc: '배경, 환경, 제약조건 제공' },
  { icon: '🎭', title: '역할 지정', desc: 'AI에게 특정 전문가 역할 부여' },
  { icon: '📏', title: '형식 지정', desc: '원하는 출력 형식 명시' },
  { icon: '🔄', title: '반복 개선', desc: '피드백으로 점진적으로 개선' },
  { icon: '✂️', title: '단계 분리', desc: '복잡한 작업을 단계별 분해' },
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

export default function PromptEngineering() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const [activeLevel, setActiveLevel] = useState(0);

  return (
    <section id="prompt" className="prompt-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-header ${inView ? 'animate-fade-up' : ''}`}>
          <div className="section-tag" style={{ color: '#43e97b', borderColor: 'rgba(67,233,123,0.3)' }}>
            PROMPT ENGINEERING
          </div>
          <h2 className="section-title">
            바이브코딩의 핵심 무기,<br />
            <span className="gradient-text">프롬프트 엔지니어링</span>
          </h2>
          <p className="section-subtitle">
            AI는 도구입니다. 도구를 잘 다루려면 <strong>올바른 사용법</strong>이 필요합니다.<br />
            프롬프트 엔지니어링은 AI와 소통하는 기술입니다.
          </p>
        </div>

        {/* Why prompt engineering */}
        <div className={`why-prompt glass ${inView ? 'animate-fade-up delay-2' : ''}`}>
          <div className="why-prompt-icon">🔑</div>
          <div className="why-prompt-content">
            <h3>왜 프롬프트 엔지니어링이 필요한가?</h3>
            <p>
              AI에게 "로그인 만들어줘"라고 하면 원하는 결과를 얻지 못할 수 있습니다.
              하지만 <strong>올바른 방법으로 질문하면 10배 더 좋은 결과</strong>를 얻습니다.
              바이브코딩에서 AI는 파트너이고, 프롬프트 엔지니어링은 그 파트너와 소통하는 언어입니다.
            </p>
            <div className="prompt-connection">
              <div className="conn-item">
                <div className="conn-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>💡</div>
                <div>
                  <div className="conn-title">아이디어</div>
                  <div className="conn-sub">머릿속의 생각</div>
                </div>
              </div>
              <div className="conn-arrow">+</div>
              <div className="conn-item">
                <div className="conn-icon" style={{ background: 'rgba(67,233,123,0.15)' }}>🔧</div>
                <div>
                  <div className="conn-title">프롬프트</div>
                  <div className="conn-sub">AI와의 소통</div>
                </div>
              </div>
              <div className="conn-arrow">=</div>
              <div className="conn-item">
                <div className="conn-icon" style={{ background: 'rgba(247,151,30,0.15)' }}>🚀</div>
                <div>
                  <div className="conn-title">결과물</div>
                  <div className="conn-sub">완성된 프로덕트</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className={`principles-grid ${inView ? 'animate-fade-up delay-3' : ''}`}>
          {principles.map((p, i) => (
            <div key={i} className="principle-card glass">
              <span className="principle-icon">{p.icon}</span>
              <span className="principle-title">{p.title}</span>
              <span className="principle-desc">{p.desc}</span>
            </div>
          ))}
        </div>

        {/* Prompt levels */}
        <div className={`prompt-levels ${inView ? 'animate-fade-up delay-4' : ''}`}>
          <h3 className="levels-title">실전 프롬프트 레벨업 가이드</h3>

          <div className="level-tabs">
            {levels.map((l, i) => (
              <button
                key={i}
                className={`level-tab ${activeLevel === i ? 'active' : ''}`}
                style={{ '--tab-color': l.color }}
                onClick={() => setActiveLevel(i)}
              >
                <span className="tab-level">{l.level}</span>
                <span className="tab-title">{l.title}</span>
              </button>
            ))}
          </div>

          <div className="level-content glass" style={{ borderColor: `${levels[activeLevel].color}33` }}>
            <div className="prompt-compare">
              <div className="prompt-box bad">
                <div className="prompt-box-header">
                  <span className="prompt-badge bad-badge">❌ 이렇게 하면</span>
                </div>
                <div className="prompt-text">{levels[activeLevel].bad}</div>
              </div>
              <div className="compare-arrow">→</div>
              <div className="prompt-box good">
                <div className="prompt-box-header">
                  <span className="prompt-badge good-badge">✅ 이렇게 하면</span>
                </div>
                <div className="prompt-text">{levels[activeLevel].good}</div>
              </div>
            </div>
            <div
              className="level-tip"
              style={{ background: `${levels[activeLevel].color}15`, borderColor: `${levels[activeLevel].color}40` }}
            >
              <span style={{ color: levels[activeLevel].color }}>💡 팁:</span>{' '}
              {levels[activeLevel].tip}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
