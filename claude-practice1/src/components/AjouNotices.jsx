import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, Search, X, ChevronDown } from 'lucide-react';
import notices from '../data/notices.json';
import ajouLogo from '../assets/ajou-logo.png';

/* ── 상수 ─────────────────────────────────────── */
const AJOU_BLUE = '#004a99';

const TABS = ['전체', '장학', '취업', '파란학기제', '기타'];

const CATEGORY_STYLE = {
  '취업':      { bg: '#EBF2FF', text: '#1A56C4' },
  '장학':      { bg: '#FFF8E6', text: '#B45309' },
  '파란학기제': { bg: '#ECFDF5', text: '#065F46' },
  '기타':      { bg: '#F5F3FF', text: '#5B21B6' },
};

/* ── OpenAI 호출 ───────────────────────────────── */
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
            '각 줄은 "• "으로 시작하고, 간결하고 명확하게 작성하세요.',
        },
        {
          role: 'user',
          content: `카테고리: ${category}\n제목: "${title}"`,
        },
      ],
      max_tokens: 220,
    }),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json().then(d => d.choices[0].message.content.trim());
}

/* ── 스켈레톤 ──────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-2 py-1">
      {[80, 65, 50].map(w => (
        <div
          key={w}
          className="h-3 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/* ── 공지 카드 ─────────────────────────────────── */
function NoticeCard({ notice }) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const catStyle = CATEGORY_STYLE[notice.category] ?? { bg: '#F3F4F6', text: '#374151' };

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
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,74,153,0.10)' }}
      transition={{ duration: 0.2 }}
    >
      {/* 공지 링크 행 */}
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-4 group"
      >
        {/* 카테고리 뱃지 */}
        <span
          className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: catStyle.bg, color: catStyle.text }}
        >
          {notice.category}
        </span>

        {/* 제목 */}
        <p className="flex-1 text-sm font-medium text-gray-800 truncate group-hover:text-[#004a99] transition-colors">
          {notice.title}
        </p>

        {/* 날짜 + 화살표 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">{notice.date}</span>
          <ExternalLink
            size={14}
            className="text-gray-300 group-hover:text-[#004a99] transition-colors"
          />
        </div>
      </a>

      {/* 구분선 */}
      <div className="mx-5 h-px bg-gray-50" />

      {/* AI 요약 버튼 */}
      <div className="px-5 py-3">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-80"
          style={{ background: `linear-gradient(135deg, ${AJOU_BLUE} 0%, #1a73e8 100%)` }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="block w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
              />
              AI가 요약하는 중...
            </>
          ) : (
            <>
              <Sparkles size={15} className="shrink-0" />
              {open && summary ? 'AI 요약 닫기' : 'AI로 이 공지 3줄 요약하기'}
              <ChevronDown
                size={15}
                className={`shrink-0 transition-transform duration-300 ${open && summary ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
      </div>

      {/* 요약 아코디언 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="summary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mx-5 mb-4 px-4 py-4 rounded-2xl bg-[#F0F6FF] border border-[#C7DEFF]">
              {loading && <Skeleton />}
              {error && (
                <p className="text-xs text-red-500 font-medium">⚠️ {error}</p>
              )}
              {summary && !loading && (
                <>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} style={{ color: AJOU_BLUE }} />
                    <span className="text-xs font-extrabold tracking-wide uppercase" style={{ color: AJOU_BLUE }}>
                      AI 요약
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {summary}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────── */
export default function AjouNotices() {
  const [activeTab, setActiveTab] = useState('전체');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return notices.filter(n => {
      const matchTab = activeTab === '전체' || n.category === activeTab;
      const matchQ =
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.category.toLowerCase().includes(query.toLowerCase());
      return matchTab && matchQ;
    });
  }, [activeTab, query]);

  return (
    <section id="notices" className="py-24" style={{ background: '#F5F5F7' }}>
      <div className="max-w-3xl mx-auto px-5">

        {/* ── 헤더 ── */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={ajouLogo}
            alt="아주대학교"
            className="h-12 w-12 object-contain rounded-2xl shadow-sm flex-shrink-0"
          />
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: AJOU_BLUE }}>
              Ajou University
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
              실시간 공지 요약
            </h2>
          </div>
          {/* AI 배지 */}
          <span
            className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: AJOU_BLUE }}
          >
            <Sparkles size={11} />
            AI 요약 지원
          </span>
        </motion.div>

        {/* ── 탭 필터 ── */}
        <motion.div
          className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: isActive ? AJOU_BLUE : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#6B7280',
                  boxShadow: isActive
                    ? `0 4px 14px rgba(0,74,153,0.30)`
                    : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {tab}
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ background: AJOU_BLUE }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── 검색창 ── */}
        <motion.div
          className="relative mb-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="공지 제목 또는 카테고리 검색"
            className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 transition-all"
            style={{ fontSize: '16px' }} /* iOS 자동확대 방지 */
            onFocus={e => (e.target.style.ringColor = AJOU_BLUE)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </motion.div>

        {/* ── 공지 리스트 ── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl py-16 text-center shadow-sm"
              >
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-bold text-gray-700 mb-1">검색 결과가 없어요</p>
                <p className="text-sm text-gray-400">다른 키워드나 카테고리로 검색해보세요</p>
              </motion.div>
            ) : (
              filtered.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <NoticeCard notice={notice} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── 푸터 카운트 + 링크 ── */}
        {filtered.length > 0 && (
          <motion.div
            className="flex items-center justify-between mt-6 px-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-gray-400">
              총 <span className="font-bold" style={{ color: AJOU_BLUE }}>{filtered.length}</span>개의 공지
            </p>
            <a
              href="https://www.ajou.ac.kr/kr/ajou/notice.do"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: AJOU_BLUE }}
            >
              전체 공지 보기
              <ExternalLink size={11} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
