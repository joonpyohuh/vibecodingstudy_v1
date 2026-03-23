import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsVibe from './components/WhatIsVibe';
import WhyLearn from './components/WhyLearn';
import PromptEngineering from './components/PromptEngineering';
import ProsCons from './components/ProsCons';
import Takeaways from './components/Takeaways';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LearningPage from './components/LearningPage';
import VibeCodingGrowth from './components/VibeCodingGrowth';
import BCubeIntro from './components/BCubeIntro';
import AjouNotices from './components/AjouNotices';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('bcube-intro-shown')
  );

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem('bcube-intro-shown', '1');
    setShowIntro(false);
  }, []);

  // 전역 스크롤 reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const attach = () =>
      document.querySelectorAll('[data-scroll]').forEach(el => obs.observe(el));
    attach();
    // 페이지 전환 후에도 재탐색
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);

  if (page === 'learn') {
    return <LearningPage onBack={() => setPage('home')} />;
  }

  if (page === 'growth') {
    return <VibeCodingGrowth onBack={() => setPage('home')} />;
  }

  return (
    <>
      {showIntro && <BCubeIntro onDone={handleIntroDone} />}
      <Navbar />
      <main>
        <Hero />
        <WhatIsVibe />
        <WhyLearn />
        <PromptEngineering />
        <ProsCons />
        <Takeaways />
        <AjouNotices />
        <CTA onLearn={() => setPage('learn')} onGrowth={() => setPage('growth')} />
      </main>
      <Footer />
    </>
  );
}

export default App;
