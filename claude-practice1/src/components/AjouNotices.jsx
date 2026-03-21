import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, Search, X, ChevronDown } from 'lucide-react';
import notices from '../data/notices.json';
import ajouLogo from '../assets/ajou-logo.png';
import './AjouNotices.css';

const TABS = ['전체', '장학', '취업', '파란학기제', '기타'];

const CATEGORY_STYLE = {
  '취업':       { bg: '#EBF2FF', color: '#1A56C4' },
  '장학':       { bg: '#FFF8E6', color: '#B45309' },
  '파란학기제':  { bg: '#ECFDF5', color: '#065F46' },
  '기타':       { bg: '#F3F0FF', color: '#5B21B6' },
};

/* ── OpenAI ──────────────────────────────────── */
async function fetchSummary(title, category) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '아주대학교 공지사항을 핵심만 3줄로 요약하는 어시스턴트입니다. ' +
            '각 줄은 "• "으로 시작하고 간결하게 작성하세요.',
        },
        { role: 'user', content: `카테고리: ${category}\n제목: "${title}"` },
      ],
      max_tokens: 220,
    }),
  });
  if (!res.ok) throw new Error(res.status);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

/* ── 스켈레톤 ──────────────────────────────────── */
function Skeleton() {
  return (
    <div className="an-skeleton">
      {[88, 68, 52].map(w => (
        <div key={w} className="an-skeleton-line" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

/* ── 공지 카드 ─────────────────────────────────── */
function NoticeCard({ notice }) {
  const [open, setOpen]       = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const cat = CATEGORY_STYLE[notice.category] ?? { bg: '#F2F4F6', color: '#6B7684' };

  const handleSummarize = async () => {
    if (summary) { setOpen(o => !o); return; }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      setSummary(await fetchSummary(notice.title, notice.category));
    } catch {
      setError('요약을 불러오지 못했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="an-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
    >
      {/* 공지 링크 */}
      <a href={notice.link} target="_blank" rel="noopener noreferrer" className="an-row">
        <span className="an-badge" style={{ background: cat.bg, color: cat.color }}>
          {notice.category}
        </span>
        <span className="an-title">{notice.title}</span>
        <span className="an-date">{notice.date}</span>
        <ExternalLink size={13} className="an-ext-icon" />
      </a>

      {/* 구분선 */}
      <div className="an-divider" />

      {/* AI 요약 버튼 */}
      <div className="an-btn-wrap">
        <button
          className={`an-ai-btn${open && summary ? ' an-ai-btn--open' : ''}`}
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="an-spinner" />
              <span>AI가 요약하는 중...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>{open && summary ? 'AI 요약 닫기' : 'AI로 이 공지 3줄 요약하기'}</span>
              <ChevronDown
                size={14}
                style={{
                  marginLeft: 'auto',
                  transition: 'transform 0.3s',
                  transform: open && summary ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </>
          )}
        </button>
      </div>

      {/* 아코디언 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="an-summary-box">
              {loading && <Skeleton />}
              {error && <p className="an-summary-error">⚠️ {error}</p>}
              {summary && !loading && (
                <>
                  <div className="an-summary-label">
                    <Sparkles size={11} />
                    AI 요약
                  </div>
                  <p className="an-summary-text">{summary}</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── 메인 ──────────────────────────────────────── */
export default function AjouNotices() {
  const [activeTab, setActiveTab] = useState('전체');
  const [query, setQuery]         = useState('');

  const filtered = useMemo(() =>
    notices.filter(n => {
      const matchTab = activeTab === '전체' || n.category === activeTab;
      const q = query.toLowerCase();
      const matchQ = n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
      return matchTab && matchQ;
    }),
    [activeTab, query]
  );

  return (
    <section id="notices" className="an-section">
      <div className="an-wrap">

        {/* 헤더 */}
        <motion.div
          className="an-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={ajouLogo} alt="아주대학교" className="an-logo" />
          <div className="an-header-text">
            <span className="an-header-sub">Ajou University</span>
            <h2 className="an-header-title">실시간 공지 요약</h2>
          </div>
          <span className="an-ai-badge">
            <Sparkles size={11} />
            AI 지원
          </span>
        </motion.div>

        {/* 탭 */}
        <motion.div
          className="an-tabs"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              className={`an-tab${activeTab === tab ? ' an-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* 검색 */}
        <motion.div
          className="an-search-wrap"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.13 }}
        >
          <Search size={15} className="an-search-icon" />
          <input
            className="an-search"
            type="text"
            placeholder="공지 제목 또는 카테고리 검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="an-search-clear" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </motion.div>

        {/* 리스트 */}
        <div className="an-list">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                className="an-empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="an-empty-icon">🔍</span>
                <p className="an-empty-title">검색 결과가 없어요</p>
                <p className="an-empty-sub">다른 키워드나 카테고리를 시도해보세요</p>
              </motion.div>
            ) : (
              filtered.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <NoticeCard notice={notice} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 하단 */}
        {filtered.length > 0 && (
          <div className="an-footer">
            <span className="an-count">
              총 <strong>{filtered.length}</strong>개
            </span>
            <a
              href="https://www.ajou.ac.kr/kr/ajou/notice.do"
              target="_blank"
              rel="noopener noreferrer"
              className="an-more"
            >
              전체 공지 보기 <ExternalLink size={11} />
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
