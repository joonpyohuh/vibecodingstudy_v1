import { useState, useEffect, useRef, useCallback } from 'react';
import './LearningPage.css';

/* ── hooks ─────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTyping(text, speed = 50) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    let i = 0;
    const t = setInterval(() => {
      setOut(text.slice(0, ++i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

/* ── data ───────────────────────────────────────────── */
const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    type: 'GUI',
    accent: '#34d399',
    symbol: 'C',
    symbolBg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    oneliner: 'AI가 내장된 코드 에디터',
    brief: 'VS Code 기반. 클릭과 단축키만으로 AI와 협업합니다.',
    chips: ['Tab 자동완성', 'AI Chat', '멀티파일 편집'],
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    type: 'CLI',
    accent: '#818cf8',
    symbol: 'G',
    symbolBg: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    oneliner: 'Google AI를 터미널에서',
    brief: '무료로 시작할 수 있는 구글의 CLI 에이전트.',
    chips: ['무료 모델 제공', '100만 토큰', '파일 전체 분석'],
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    type: 'CLI',
    accent: '#fb923c',
    symbol: 'O',
    symbolBg: 'linear-gradient(135deg, #1a0a00, #3d1c00, #5c2a00)',
    oneliner: 'OpenAI의 코드 전용 에이전트',
    brief: '자연어 한 줄로 테스트·PR까지 자동 생성합니다.',
    chips: ['샌드박스 실행', '테스트 자동화', 'git PR 생성'],
  },
  {
    id: 'claude',
    name: 'Claude Code',
    type: 'CLI',
    accent: '#f472b6',
    symbol: '✦',
    symbolBg: 'linear-gradient(135deg, #1a0010, #3d0025, #5c003a)',
    oneliner: '이 페이지를 만든 도구',
    brief: '프로젝트 전체를 이해하고 파일·git을 자율 실행합니다.',
    chips: ['전체 컨텍스트', '파일 자동 편집', 'git 커밋'],
    isMaker: true,
  },
];

const CLI_LINES = [
  { text: '$ claude "학습 페이지 만들어줘"', type: 'cmd' },
  { text: '✦ 프로젝트 파악 중…', type: 'info', delay: 700 },
  { text: '✓ LearningPage.jsx 생성', type: 'ok', delay: 1400 },
  { text: '✓ LearningPage.css 생성', type: 'ok', delay: 1900 },
  { text: '✓ App.jsx 라우팅 추가', type: 'ok', delay: 2400 },
  { text: '$ _', type: 'cmd', delay: 3000 },
];

/* ── ToolCard ────────────────────────────────────────── */
function ToolCard({ tool, idx }) {
  const [ref, inView] = useInView(0.08);

  return (
    <article
      ref={ref}
      className={`tc ${inView ? 'tc--in' : ''} ${tool.isMaker ? 'tc--maker' : ''}`}
      style={{ '--i': idx }}
    >
      {tool.isMaker && <div className="tc-ribbon">Made with this</div>}

      <div className="tc-top">
        <div className="tc-symbol" style={{ background: tool.symbolBg }}>
          {tool.symbol}
        </div>
        <div className="tc-meta">
          <span className="tc-type" style={{ color: tool.accent }}>{tool.type}</span>
          <h3 className="tc-name">{tool.name}</h3>
        </div>
      </div>

      <p className="tc-oneliner">{tool.oneliner}</p>
      <p className="tc-brief">{tool.brief}</p>

      <div className="tc-chips">
        {tool.chips.map((c, i) => (
          <span key={i} className="tc-chip" style={{ '--accent': tool.accent }}>{c}</span>
        ))}
      </div>
    </article>
  );
}


/* ── GuiCliSection ───────────────────────────────────── */
function GuiCliSection() {
  const [ref, inView] = useInView(0.08);
  const [tab, setTab] = useState('gui');
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (tab !== 'cli') { setLines([]); return; }
    setLines([]);
    CLI_LINES.forEach(({ text, type, delay = 0 }) => {
      setTimeout(() => setLines(p => [...p, { text, type }]), delay);
    });
  }, [tab]);

  return (
    <section className="gc-section" ref={ref}>
      <div className="section-container">
        <div className={`lp-section-head ${inView ? 'animate-fade-up' : ''}`}>
          <div className="lp-eyebrow">핵심 개념</div>
          <h2 className="lp-h2">GUI <span className="lp-muted">vs</span> CLI</h2>
          <p className="lp-lead">두 가지 인터페이스, 각각의 강점이 있습니다.</p>
        </div>

        {/* 탭 */}
        <div className={`gc-tabs ${inView ? 'animate-fade-up delay-2' : ''}`}>
          {[
            { id: 'gui', label: '🖱 GUI 체험' },
            { id: 'cli', label: '⌨️ CLI 체험' },
          ].map(t => (
            <button
              key={t.id}
              className={`gc-tab ${tab === t.id ? 'gc-tab--on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 데모 */}
        <div className={`gc-demo ${inView ? 'animate-fade-up delay-3' : ''}`}>
          {tab === 'gui' ? (
            <div className="demo-gui">
              <div className="demo-bar">
                <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
                <span className="demo-title">Cursor — App.jsx</span>
              </div>
              <div className="demo-gui-body">
                <div className="demo-sidebar">
                  {['📁 src', '  📄 App.jsx', '  📄 index.css', '📁 public'].map((f, i) => (
                    <div key={i} className={`demo-file ${i === 1 ? 'demo-file--on' : ''}`}>{f}</div>
                  ))}
                </div>
                <div className="demo-editor">
                  <div className="demo-line"><span className="ln">1</span><span className="kw">import</span> React <span className="kw">from</span> <span className="str">'react'</span></div>
                  <div className="demo-line demo-line--sel"><span className="ln">2</span><span className="kw">export default function</span> <span className="fn">App</span>() {'{'}</div>
                  <div className="demo-line"><span className="ln">3</span>  <span className="kw">return</span> &lt;<span className="tag">div</span>&gt;Hello&lt;/<span className="tag">div</span>&gt;</div>
                  <div className="demo-line"><span className="ln">4</span>{'}'}</div>
                  <div className="ai-popup">
                    <span className="ai-icon">✦</span>
                    <div>
                      <div className="ai-label">AI 제안</div>
                      <div className="ai-text">컴포넌트를 개선할까요?</div>
                    </div>
                    <kbd className="ai-key">Tab ↹</kbd>
                  </div>
                </div>
              </div>
              <p className="demo-caption">눈에 보이는 화면을 마우스·키보드로 조작합니다</p>
            </div>
          ) : (
            <div className="demo-cli">
              <div className="demo-bar">
                <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
                <span className="demo-title">Terminal</span>
              </div>
              <div className="demo-cli-body">
                {lines.map((l, i) => (
                  <div key={i} className={`cli-row cli-row--${l.type}`}>{l.text}</div>
                ))}
                {lines.length > 0 && <span className="cli-cursor">█</span>}
              </div>
              <p className="demo-caption">텍스트 명령어로 컴퓨터를 직접 제어합니다</p>
            </div>
          )}
        </div>

        {/* 비교 */}
        <div className={`gc-compare ${inView ? 'animate-fade-up delay-4' : ''}`}>
          <div className="gc-col gc-col--gui">
            <h4>🖱 GUI</h4>
            <ul>
              <li>직관적인 시각 인터페이스</li>
              <li>마우스로 즉시 조작</li>
              <li>낮은 진입 장벽</li>
            </ul>
            <div className="gc-tools-tag">Cursor · VS Code</div>
          </div>
          <div className="gc-vs">vs</div>
          <div className="gc-col gc-col--cli">
            <h4>⌨️ CLI</h4>
            <ul>
              <li>강력한 자동화·스크립팅</li>
              <li>빠른 반복·배치 작업</li>
              <li>서버·원격 환경 필수</li>
            </ul>
            <div className="gc-tools-tag">Claude Code · Gemini CLI</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── LearningPage (main) ────────────────────────────── */
export default function LearningPage({ onBack }) {
  const [scrollY, setScrollY] = useState(0);
  const heroTyped = useTyping('바이브코딩 도구 가이드', 55);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="lp">

      {/* nav */}
      <nav className="lp-nav">
        <button className="lp-back" onClick={onBack}>← 홈으로</button>
        <div className="lp-nav-center">
          <span className="lp-nav-dot" />
          바이브코딩 학습 센터
        </div>
        <div className="lp-nav-right">🤖 Claude Code로 만들어졌어요!</div>
      </nav>

      {/* hero */}
      <header className="lp-hero" style={{ '--py': `${scrollY * 0.25}px` }}>
        <div className="lp-hero-bg" />

        <div className="lp-hero-content">
          <div className="lp-chip animate-bounce-in">B-CUBE · 학습 자료</div>

          <h1 className="lp-hero-h1 animate-fade-up delay-2">
            <span className="gradient-text">{heroTyped}</span>
            <span className="lp-caret">|</span>
          </h1>

          <p className="lp-hero-sub animate-fade-up delay-4">
            Cursor, Gemini CLI, Codex, Claude Code<br />
            GUI · CLI의 차이까지 한눈에
          </p>

          <div className="lp-hero-nums animate-fade-up delay-6">
            {[['4', '핵심 도구'], ['2', '인터페이스 유형'], ['∞', '가능성']].map(([n, l], i) => (
              <div key={i} className="lp-num">
                <span className="lp-num-n gradient-text">{n}</span>
                <span className="lp-num-l">{l}</span>
              </div>
            ))}
          </div>

          {/* made badge */}
          <div className="lp-made animate-fade-up delay-8">
            <span className="lp-made-icon">✦</span>
            <div>
              <div className="lp-made-t">Claude Code로 만들어졌어요!</div>
              <div className="lp-made-s">이 페이지 자체가 바이브코딩의 결과물입니다</div>
            </div>
          </div>
        </div>
      </header>

      {/* tools */}
      <section className="lp-tools">
        <div className="section-container">
          <div className="lp-section-head animate-fade-up">
            <div className="lp-eyebrow">핵심 도구</div>
            <h2 className="lp-h2">바이브코딩 <span className="gradient-text">4대 도구</span></h2>
          </div>
          <div className="tc-grid">
            {TOOLS.map((t, i) => <ToolCard key={t.id} tool={t} idx={i} />)}
          </div>
        </div>
      </section>

      {/* gui vs cli */}
      <GuiCliSection />

      {/* footer cta */}
      <section className="lp-fcta">
        <div className="section-container">
          <div className="lp-fcta-inner">
            <div className="lp-eyebrow">바이브코딩</div>
            <h2 className="lp-fcta-title">
              이제 <span className="gradient-text">직접 만들 차례</span>입니다
            </h2>
            <p className="lp-fcta-sub">
              첫 번째 명령어를 입력하는 순간, 바이브코딩이 시작됩니다.
            </p>
            <div className="lp-fcta-made">
              <span>✦</span>
              <span><strong>Claude Code로 만들어졌어요</strong> — 이 사이트가 바이브코딩의 증거입니다</span>
            </div>
            <button className="lp-fcta-btn" onClick={onBack}>← 메인으로 돌아가기</button>
          </div>
        </div>
      </section>
    </div>
  );
}
