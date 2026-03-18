import { useState, useEffect } from 'react';
import './Navbar.css';

const navItems = [
  { label: '바이브코딩이란?', href: '#what' },
  { label: '왜 배워야?', href: '#why' },
  { label: '프롬프트 엔지니어링', href: '#prompt' },
  { label: '장단점', href: '#pros-cons' },
  { label: '얻어가는 것', href: '#takeaways' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo" onClick={e => handleNav(e, '#hero')}>
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">VibeCode</span>
          <span className="logo-badge">STUDY</span>
        </a>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item, i) => (
            <li key={i}>
              <a href={item.href} onClick={e => handleNav(e, item.href)}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#cta" className="nav-cta" onClick={e => handleNav(e, '#cta')}>
              시작하기 🚀
            </a>
          </li>
        </ul>

        <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
