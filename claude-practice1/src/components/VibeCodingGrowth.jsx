import { useState, useEffect, useRef } from 'react';
import './VibeCodingGrowth.css';

/* ── 커스텀 훅 ───────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ── 데이터 ───────────────────────────────── */
const TIMELINE = [
  {
    year: '2021',
    emoji: '🔧',
    color: '#6366f1',
    title: 'GitHub Copilot 출시',
    desc: 'AI 코드 자동완성의 시대 개막. 개발자들이 처음으로 AI와 함께 코드를 작성하기 시작했습니다.',
    tag: '시작점',
  },
  {
    year: '2022',
    emoji: '💬',
    color: '#8b5cf6',
    title: 'ChatGPT 등장',
    desc: '출시 5일 만에 100만 사용자 돌파. 자연어로 코드를 생성하는 시대가 열렸습니다.',
    tag: '혁명의 시작',
  },
  {
    year: '2023',
    emoji: '⚡',
    color: '#3a3aff',
    title: 'GPT-4 · Claude · Gemini 경쟁',
    desc: 'AI 코딩 어시스턴트 춘추전국시대. Cursor, Copilot Chat 등 전문 도구들이 쏟아졌습니다.',
    tag: '춘추전국시대',
  },
  {
    year: '2024.03',
    emoji: '🤖',
    color: '#0ea5e9',
    title: 'Devin — 첫 AI 소프트웨어 엔지니어',
    desc: '자율적으로 버그를 수정하고 기능을 구현하는 AI 에이전트가 등장했습니다.',
    tag: 'AI 에이전트',
  },
  {
    year: '2025.02',
    emoji: '🌊',
    color: '#00c060',
    title: '"Vibe Coding" 용어 탄생',
    desc: 'Andrej Karpathy(전 OpenAI 공동창립자)가 바이브코딩을 공식 정의. 코드를 몰라도 AI로 만드는 새로운 패러다임.',
    tag: '패러다임 전환',
  },
  {
    year: '2025',
    emoji: '🚀',
    color: '#ff9500',
    title: 'Claude Code · Gemini CLI 출시',
    desc: '터미널에서 AI와 대화하며 전체 프로젝트를 구축하는 시대. 개발의 경계가 사라지고 있습니다.',
    tag: '지금 이 순간',
  },
  {
    year: '2026~',
    emoji: '🌐',
    color: '#ff3b6b',
    title: '완전 자율 AI 개발 에이전트',
    desc: '기획 → 디자인 → 개발 → 배포까지 AI가 단독으로 수행하는 시대가 다가오고 있습니다.',
    tag: '가까운 미래',
    future: true,
  },
];

const STATS = [
  { value: 1300000, suffix: '명+', label: 'GitHub Copilot 유료 구독자', sub: '2023년 기준', color: '#3a3aff' },
  { value: 55, suffix: '%', label: '개발 속도 향상', sub: 'GitHub 공식 연구 결과', color: '#00c060' },
  { value: 92, suffix: '%', label: '개발자 AI 도구 사용률', sub: 'Stack Overflow 2024', color: '#ff9500' },
  { value: 5, suffix: '일', label: 'ChatGPT 100만 돌파', sub: '역대 가장 빠른 서비스', color: '#ff3b6b' },
];

const SPEED_ITEMS = [
  {
    icon: '📈',
    title: 'Cursor ARR',
    before: '$0',
    after: '$9억+',
    period: '2년 만에',
    color: '#3a3aff',
  },
  {
    icon: '🧑‍💻',
    title: 'AI 코딩 시장 규모',
    before: '$0.4B',
    after: '$12B+',
    period: '2021 → 2028 전망',
    color: '#00c060',
  },
  {
    icon: '⚡',
    title: 'GitHub Copilot 유저',
    before: '0',
    after: '130만',
    period: '2년 만에',
    color: '#ff9500',
  },
  {
    icon: '🔥',
    title: '바이브코딩 검색량',
    before: '0',
    after: '1000%↑',
    period: '2025년 3개월',
    color: '#ff3b6b',
  },
];

const GOOGLE_UPDATES = [
  {
    icon: '🔥',
    product: 'Firebase Studio',
    tag: 'Google I/O 2025',
    tagColor: '#ff3b6b',
    title: '브라우저에서 풀스택 앱을 한 번에',
    desc: '기존 Project IDX가 Firebase Studio로 진화. 브라우저 하나로 프론트엔드·백엔드·DB·배포까지 완성. Gemini AI가 실시간으로 코드를 생성하며 앱 구조를 제안합니다.',
    highlights: ['Gemini 2.5 Pro 통합', '원클릭 배포', '실시간 미리보기', '풀스택 템플릿'],
  },
  {
    icon: '✨',
    product: 'Gemini 2.5 Pro',
    tag: '2025 최신',
    tagColor: '#3a3aff',
    title: '단 한 줄의 프롬프트로 풀스택 앱 생성',
    desc: '"실시간 채팅 앱 만들어줘" 한 마디로 React 프론트엔드 + Node 백엔드 + DB 스키마가 완성됩니다. Google I/O 2025에서 실시간 시연으로 전 세계를 충격에 빠뜨렸습니다.',
    highlights: ['100만 토큰 컨텍스트', '멀티모달 입력', '코드 전체 이해', '자동 리팩토링'],
  },
  {
    icon: '🤖',
    product: 'Jules (AI Agent)',
    tag: 'GitHub 통합',
    tagColor: '#00c060',
    title: 'GitHub 이슈 → 자율 PR 생성',
    desc: 'GitHub 이슈를 배정받으면 Jules가 코드를 직접 수정하고 PR까지 올립니다. 사람이 리뷰만 하면 됩니다. "버그 수정 담당 AI 팀원"이 실제로 등장했습니다.',
    highlights: ['GitHub 이슈 자동 처리', '코드 수정 + PR 생성', '테스트 자동 실행', '리뷰 대기'],
  },
  {
    icon: '⌨️',
    product: 'Gemini CLI',
    tag: '무료 공개',
    tagColor: '#ff9500',
    title: '터미널에서 전체 코드베이스를 AI가 분석',
    desc: '100만 토큰 컨텍스트로 대형 프로젝트 전체를 한 번에 읽습니다. Claude Code처럼 파일 생성·수정·git 커밋까지 자율 실행. 무료로 사용 가능합니다.',
    highlights: ['100만 토큰', '전체 프로젝트 분석', '파일 자율 편집', '무료 제공'],
  },
];

const EFFICIENCY_STATS = [
  {
    icon: '⚡',
    label: '작업 완료 속도',
    human: 100,
    ai: 155,
    unit: '%',
    humanLabel: '혼자',
    aiLabel: 'AI 협업',
    color: '#3a3aff',
    source: 'GitHub 공식 연구',
  },
  {
    icon: '🐛',
    label: '버그 발견·수정 속도',
    human: 100,
    ai: 220,
    unit: '%',
    humanLabel: '수동 디버깅',
    aiLabel: 'AI 보조',
    color: '#00c060',
    source: 'McKinsey 2024',
  },
  {
    icon: '📝',
    label: '코드 리뷰 처리량',
    human: 100,
    ai: 300,
    unit: '%',
    humanLabel: '사람만',
    aiLabel: 'AI 초안 + 사람 검토',
    color: '#ff9500',
    source: 'Stack Overflow 2024',
  },
  {
    icon: '🚀',
    label: '프로토타입 제작 속도',
    human: 100,
    ai: 500,
    unit: '%',
    humanLabel: '전통 방식',
    aiLabel: '바이브코딩',
    color: '#ff3b6b',
    source: 'Cursor 내부 데이터',
  },
];

const FUTURE_CARDS = [
  {
    icon: '🧠',
    title: '자연어 = 코드',
    desc: '프로그래밍 언어를 몰라도 아이디어를 말하면 AI가 완성된 앱을 만들어줍니다.',
    gradient: 'linear-gradient(135deg, #3a3aff22, #6366f133)',
    border: '#3a3aff44',
  },
  {
    icon: '🤝',
    title: 'AI와의 협업',
    desc: '개발자의 역할이 "코드 작성"에서 "AI 방향 설정"으로 전환됩니다.',
    gradient: 'linear-gradient(135deg, #00c06022, #10b98133)',
    border: '#00c06044',
  },
  {
    icon: '🌍',
    title: '누구나 개발자',
    desc: '기술 장벽이 낮아져 아이디어만 있으면 누구나 제품을 만들 수 있는 세상이 옵니다.',
    gradient: 'linear-gradient(135deg, #ff950022, #f59e0b33)',
    border: '#ff950044',
  },
  {
    icon: '🚀',
    title: '10배 빠른 개발',
    desc: '반복적인 작업을 AI가 처리하여 핵심 로직과 창의적 판단에만 집중할 수 있습니다.',
    gradient: 'linear-gradient(135deg, #ff3b6b22, #ec489933)',
    border: '#ff3b6b44',
  },
];

/* ── 서브 컴포넌트 ─────────────────────────── */
function StatCard({ value, suffix, label, sub, color, inView }) {
  const count = useCounter(value, 2000, inView);
  const display = value >= 10000
    ? (count / 10000).toFixed(1) + '만'
    : count.toLocaleString();

  return (
    <div className="vcg-stat-card">
      <div className="vcg-stat-num" style={{ color }}>
        {display}{suffix}
      </div>
      <div className="vcg-stat-label">{label}</div>
      <div className="vcg-stat-sub">{sub}</div>
      <div className="vcg-stat-bar" style={{ background: color + '33' }}>
        <div className="vcg-stat-bar-fill" style={{ background: color, width: inView ? '100%' : '0%' }} />
      </div>
    </div>
  );
}

/* ── 메인 페이지 ───────────────────────────── */
export default function VibeCodingGrowth({ onBack }) {
  const [statsRef, statsInView] = useInView(0.2);
  const [speedRef, speedInView] = useInView(0.15);
  const [futureRef, futureInView] = useInView(0.15);
  const [timelineRef, timelineInView] = useInView(0.05);
  const [googleRef, googleInView] = useInView(0.08);
  const [effRef, effInView] = useInView(0.1);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="vcg-page">
      {/* ── 상단 네비 ── */}
      <nav className="vcg-nav">
        <button className="vcg-back-btn" onClick={onBack}>
          ← 홈으로
        </button>
        <span className="vcg-nav-title">
          <span className="vcg-nav-icon">📈</span>
          바이브코딩 성장 현황
        </span>
        <div />
      </nav>

      {/* ── 히어로 ── */}
      <section className="vcg-hero">
        <div className="vcg-hero-bg">
          <div className="vcg-orb vcg-orb-1" />
          <div className="vcg-orb vcg-orb-2" />
          <div className="vcg-orb vcg-orb-3" />
        </div>
        <div className="vcg-hero-content">
          <div className="vcg-hero-badge animate-bounce-in">
            🌊 패러다임 전환
          </div>
          <h1 className="vcg-hero-title animate-fade-in-up">
            바이브코딩,<br />
            <span className="gradient-text">얼마나 빠르게</span><br />
            성장하고 있을까?
          </h1>
          <p className="vcg-hero-desc animate-fade-in-up delay-3">
            2021년 GitHub Copilot 한 줄에서 시작된 혁명.<br />
            불과 4년 만에 세상의 코딩 방식이 완전히 바뀌었습니다.
          </p>
          <a href="#vcg-timeline" className="vcg-hero-scroll">
            <span>타임라인 보기</span>
            <span className="vcg-scroll-arrow">↓</span>
          </a>
        </div>
      </section>

      {/* ── 통계 카드 ── */}
      <section className="vcg-stats-section" ref={statsRef}>
        <div className="vcg-container">
          <div className="vcg-section-label">BY THE NUMBERS</div>
          <h2 className="vcg-section-title">숫자로 보는 성장</h2>
          <div className="vcg-stats-grid">
            {STATS.map((s, i) => (
              <StatCard key={i} {...s} inView={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 타임라인 ── */}
      <section className="vcg-timeline-section" id="vcg-timeline" ref={timelineRef}>
        <div className="vcg-container">
          <div className="vcg-section-label">EVOLUTION</div>
          <h2 className="vcg-section-title">바이브코딩의 역사</h2>
          <p className="vcg-section-desc">2021년부터 현재까지, 불과 4년간 일어난 믿기 힘든 변화들</p>

          <div className="vcg-timeline">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`vcg-timeline-item ${item.future ? 'vcg-future' : ''} ${timelineInView ? 'vcg-tl-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="vcg-tl-line">
                  <div className="vcg-tl-dot" style={{ background: item.color, boxShadow: `0 0 12px ${item.color}66` }} />
                  {i < TIMELINE.length - 1 && <div className="vcg-tl-connector" />}
                </div>
                <div className="vcg-tl-card">
                  <div className="vcg-tl-header">
                    <span className="vcg-tl-year" style={{ color: item.color }}>{item.year}</span>
                    <span className="vcg-tl-tag" style={{ background: item.color + '22', color: item.color, border: `1px solid ${item.color}44` }}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="vcg-tl-emoji">{item.emoji}</div>
                  <h3 className="vcg-tl-title">{item.title}</h3>
                  <p className="vcg-tl-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 성장 속도 ── */}
      <section className="vcg-speed-section" ref={speedRef}>
        <div className="vcg-container">
          <div className="vcg-section-label">SPEED</div>
          <h2 className="vcg-section-title">믿기 힘든 성장 속도</h2>
          <p className="vcg-section-desc">기존 산업과는 차원이 다른 AI 코딩 시장의 폭발적 성장</p>

          <div className="vcg-speed-grid">
            {SPEED_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`vcg-speed-card ${speedInView ? 'vcg-speed-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="vcg-speed-icon">{item.icon}</div>
                <div className="vcg-speed-title">{item.title}</div>
                <div className="vcg-speed-period" style={{ color: item.color }}>{item.period}</div>
                <div className="vcg-speed-nums">
                  <div className="vcg-speed-before">
                    <span className="vcg-speed-label-sm">이전</span>
                    <span className="vcg-speed-val-before">{item.before}</span>
                  </div>
                  <div className="vcg-speed-arrow" style={{ color: item.color }}>→</div>
                  <div className="vcg-speed-after">
                    <span className="vcg-speed-label-sm">현재</span>
                    <span className="vcg-speed-val-after" style={{ color: item.color }}>{item.after}</span>
                  </div>
                </div>
                <div className="vcg-speed-bar-bg">
                  <div
                    className="vcg-speed-bar-fill"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                      width: speedInView ? '100%' : '0%',
                      transitionDelay: `${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google AI Studio 발표 ── */}
      <section className="vcg-google-section" ref={googleRef}>
        <div className="vcg-container">
          <div className="vcg-live-badge">
            <span className="vcg-live-dot" />
            BREAKING — 2025 최신 발표
          </div>
          <h2 className="vcg-section-title vcg-white">Google이 쏘아올린 공</h2>
          <p className="vcg-section-desc vcg-gray">
            Google I/O 2025에서 공개된 풀스택 바이브코딩 도구들.<br />
            이제 비개발자도 브라우저 하나로 실제 서비스를 만들 수 있습니다.
          </p>

          <div className="vcg-google-grid">
            {GOOGLE_UPDATES.map((item, i) => (
              <div
                key={i}
                className={`vcg-google-card ${googleInView ? 'vcg-google-in' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="vcg-google-top">
                  <span className="vcg-google-icon">{item.icon}</span>
                  <span className="vcg-google-tag" style={{ background: item.tagColor + '22', color: item.tagColor, border: `1px solid ${item.tagColor}44` }}>
                    {item.tag}
                  </span>
                </div>
                <div className="vcg-google-product">{item.product}</div>
                <h3 className="vcg-google-title">{item.title}</h3>
                <p className="vcg-google-desc">{item.desc}</p>
                <div className="vcg-google-highlights">
                  {item.highlights.map((h, j) => (
                    <span key={j} className="vcg-google-chip">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`vcg-google-banner ${googleInView ? 'vcg-gbanner-in' : ''}`}>
            <div className="vcg-gbanner-pulse" />
            <div className="vcg-gbanner-text">
              <strong>6개월 전 상상도 못했던 일이 오늘 현실입니다.</strong>
              <span> 이 속도라면 6개월 후는 또 어떻게 바뀔까요?</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI 효율성 & 능률 ── */}
      <section className="vcg-eff-section" ref={effRef}>
        <div className="vcg-container">
          <div className="vcg-section-label">EFFICIENCY</div>
          <h2 className="vcg-section-title">AI가 만드는 압도적인 차이</h2>
          <p className="vcg-section-desc">단순한 도움이 아닙니다. AI는 개발 생산성의 패러다임 자체를 바꾸고 있습니다.</p>

          <div className="vcg-eff-grid">
            {EFFICIENCY_STATS.map((item, i) => (
              <div
                key={i}
                className={`vcg-eff-card ${effInView ? 'vcg-eff-in' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="vcg-eff-icon">{item.icon}</div>
                <div className="vcg-eff-label">{item.label}</div>

                <div className="vcg-eff-bars">
                  <div className="vcg-eff-bar-row">
                    <span className="vcg-eff-bar-label">{item.humanLabel}</span>
                    <div className="vcg-eff-bar-track">
                      <div
                        className="vcg-eff-bar-fill vcg-eff-bar-human"
                        style={{ width: effInView ? `${(item.human / item.ai) * 100}%` : '0%', transitionDelay: `${0.3 + i * 0.12}s` }}
                      />
                    </div>
                    <span className="vcg-eff-bar-val vcg-muted">{item.human}{item.unit}</span>
                  </div>
                  <div className="vcg-eff-bar-row">
                    <span className="vcg-eff-bar-label vcg-eff-bar-label--ai" style={{ color: item.color }}>{item.aiLabel}</span>
                    <div className="vcg-eff-bar-track">
                      <div
                        className="vcg-eff-bar-fill"
                        style={{ background: item.color, width: effInView ? '100%' : '0%', transitionDelay: `${0.45 + i * 0.12}s` }}
                      />
                    </div>
                    <span className="vcg-eff-bar-val" style={{ color: item.color }}>{item.ai}{item.unit}</span>
                  </div>
                </div>

                <div className="vcg-eff-multiplier" style={{ color: item.color }}>
                  {(item.ai / item.human).toFixed(1)}x 빠름
                </div>
                <div className="vcg-eff-source">{item.source}</div>
              </div>
            ))}
          </div>

          <div className={`vcg-eff-quote ${effInView ? 'vcg-eff-quote-in' : ''}`}>
            <div className="vcg-eff-quote-mark">"</div>
            <p className="vcg-eff-quote-text">
              소프트웨어 엔지니어링의 95%는 곧 AI가 할 것입니다.<br />
              나머지 5%는 AI에게 무엇을 시킬지 결정하는 사람의 몫입니다.
            </p>
            <div className="vcg-eff-quote-author">— Jensen Huang, NVIDIA CEO</div>
          </div>
        </div>
      </section>

      {/* ── 미래 전망 ── */}
      <section className="vcg-future-section" ref={futureRef}>
        <div className="vcg-container">
          <div className="vcg-section-label">FUTURE</div>
          <h2 className="vcg-section-title">앞으로 어떻게 될까?</h2>
          <p className="vcg-section-desc">전문가들이 예측하는 AI 코딩의 미래, 그리고 우리에게 필요한 것</p>

          <div className="vcg-future-grid">
            {FUTURE_CARDS.map((card, i) => (
              <div
                key={i}
                className={`vcg-future-card ${futureInView ? 'vcg-future-visible' : ''}`}
                style={{
                  transitionDelay: `${i * 0.12}s`,
                  background: card.gradient,
                  border: `1px solid ${card.border}`,
                }}
              >
                <div className="vcg-future-icon">{card.icon}</div>
                <h3 className="vcg-future-title">{card.title}</h3>
                <p className="vcg-future-desc">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* 결론 배너 */}
          <div className={`vcg-conclusion ${futureInView ? 'vcg-conclusion-visible' : ''}`}>
            <div className="vcg-conclusion-icon">💡</div>
            <div className="vcg-conclusion-text">
              <strong>지금이 바로 시작할 때입니다.</strong>
              <span> 바이브코딩은 트렌드가 아니라, 새로운 기본기입니다.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 푸터 CTA ── */}
      <section className="vcg-footer-cta">
        <div className="vcg-container">
          <h2 className="vcg-fcta-title">이 흐름에 올라타세요</h2>
          <p className="vcg-fcta-desc">B-CUBE 바이브코딩 스터디와 함께 AI 시대를 준비하세요</p>
          <button className="vcg-fcta-btn" onClick={onBack}>
            홈으로 돌아가기 →
          </button>
        </div>
      </section>
    </div>
  );
}
