import { useState, useMemo } from 'react';
import notices from '../data/notices.json';
import ajouLogo from '../assets/ajou-logo.png';
import './AjouNotices.css';

const CATEGORY_COLORS = {
  '취업':      { bg: '#E8F3FF', text: '#1A6FC4' },
  '장학':      { bg: '#FFF4E5', text: '#C47B00' },
  '파란학기제': { bg: '#EDF9F0', text: '#1A7B3E' },
  '기타':      { bg: '#F4F0FF', text: '#6B3FA0' },
};

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] ?? { bg: '#F2F4F6', text: '#6B7684' };
  return (
    <span className="notice-badge" style={{ background: color.bg, color: color.text }}>
      {category}
    </span>
  );
}

async function fetchSummary(title) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 대학교 공지사항을 간결하게 요약해주는 어시스턴트입니다. ' +
            '공지 제목을 보고 어떤 내용인지 핵심만 2~3문장으로 설명해주세요. ' +
            '추측이 포함된 경우 "~으로 보입니다" 같은 표현을 사용하세요.',
        },
        {
          role: 'user',
          content: `아주대학교 공지사항 제목: "${title}"`,
        },
      ],
      max_tokens: 200,
    }),
  });

  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

function NoticeItem({ notice, index }) {
  const [summary, setSummary] = useState(null);   // null | string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (summary) {
      setOpen(prev => !prev);
      return;
    }

    setLoading(true);
    setError(null);
    setOpen(true);
    try {
      const text = await fetchSummary(notice.title);
      setSummary(text);
    } catch (err) {
      setError('요약을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li
      className="notice-item"
      data-scroll
      data-scroll-delay={String(Math.min(index + 1, 6))}
    >
      {/* 메인 링크 행 */}
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        className="notice-link"
      >
        <CategoryBadge category={notice.category} />
        <p className="notice-title">{notice.title}</p>
        <div className="notice-meta">
          <span className="notice-date">{notice.date}</span>
          <svg className="notice-arrow" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </a>

      {/* 구분선 */}
      <div className="notice-divider" />

      {/* AI 요약 버튼 — 눈에 띄는 그라디언트 */}
      <div className="notice-ai-row">
        <button
          className={`ai-summary-btn ${loading ? 'loading' : ''} ${open && summary ? 'open' : ''}`}
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="ai-spinner" />
              <span>AI가 요약하는 중...</span>
            </>
          ) : open && summary ? (
            <>
              <span className="ai-btn-icon">✨</span>
              <span>AI 요약 닫기</span>
            </>
          ) : (
            <>
              <span className="ai-btn-icon">✨</span>
              <span>AI로 이 공지 요약하기</span>
            </>
          )}
        </button>
      </div>

      {/* 요약 결과 */}
      {open && (
        <div className="summary-box">
          {loading && (
            <div className="summary-skeleton">
              <div className="skeleton-line" style={{ width: '90%' }} />
              <div className="skeleton-line" style={{ width: '75%' }} />
              <div className="skeleton-line" style={{ width: '55%' }} />
            </div>
          )}
          {error && <p className="summary-error">⚠️ {error}</p>}
          {summary && (
            <>
              <p className="summary-label">✨ AI 요약</p>
              <p className="summary-text">{summary}</p>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function SummaryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M10.5 3.5l-2 2M5.5 10.5l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function AjouNotices() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() =>
    notices.filter(n =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.category.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <section className="notices-section" id="notices">
      <div className="notices-inner">

        {/* 왼쪽 고정 패널 */}
        <aside className="notices-aside" data-scroll="left">
          <img src={ajouLogo} alt="아주대학교" className="ajou-logo" />
          <h2 className="aside-title">아주대학교<br />공지사항</h2>
          <p className="aside-desc">
            최신 학교 공지를<br />한눈에 확인하세요.
          </p>
          <div className="aside-stat">
            <span className="stat-num">{filtered.length}</span>
            <span className="stat-label">개의 공지</span>
          </div>
          <div className="aside-ai-badge">
            <SparkleIcon />
            AI 요약 지원
          </div>
          <a
            href="https://www.ajou.ac.kr/kr/ajou/notice.do"
            target="_blank"
            rel="noopener noreferrer"
            className="aside-more-btn"
          >
            전체 공지 보기 →
          </a>
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <div className="notices-content">

          {/* 검색 */}
          <div className="search-wrap" data-scroll data-scroll-delay="1">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9EA7B1" strokeWidth="1.8"/>
              <path d="M13.5 13.5L17 17" stroke="#9EA7B1" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="공지 제목 또는 카테고리 검색"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="지우기">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* 리스트 */}
          <ul className="notices-list">
            {filtered.length === 0 ? (
              <li className="notices-empty" data-scroll>
                <div className="empty-icon">🔍</div>
                <p className="empty-title">검색 결과가 없어요</p>
                <p className="empty-sub">다른 키워드로 검색해보세요</p>
              </li>
            ) : (
              filtered.map((notice, i) => (
                <NoticeItem key={notice.id} notice={notice} index={i} />
              ))
            )}
          </ul>
        </div>

      </div>
    </section>
  );
}
