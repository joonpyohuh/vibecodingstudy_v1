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
                <li
                  key={notice.id}
                  className="notice-item"
                  data-scroll
                  data-scroll-delay={String(Math.min(i + 1, 6))}
                >
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
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </section>
  );
}
