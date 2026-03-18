import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner section-container">
        <div className="footer-brand">
          <span className="footer-logo">⚡ <span className="gradient-text">VibeCode</span> STUDY</span>
          <p className="footer-tagline">AI와 함께 느낌대로 만드는 세상</p>
        </div>
        <div className="footer-divider" />
        <p className="footer-copy">
          © 2025 VibeCode Study — 바이브코딩 스터디 그룹. Made with ❤️ & AI
        </p>
      </div>
    </footer>
  );
}
