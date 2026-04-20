import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'vibecoding-newsletter-subscribers';

const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const loadSubscribers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveSubscribers = (subscribers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
};

const syncSubscriberToServer = async (subscriber) => {
  try {
    await fetch('/api/newsletter/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriber),
    });
  } catch {
    // 백엔드가 아직 없더라도 프론트에서 구독 목록을 확인할 수 있도록 로컬 저장을 유지한다.
  }
};

function App() {
  const [page, setPage] = useState('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    setSubscribers(loadSubscribers());
  }, []);

  const sortedSubscribers = useMemo(
    () =>
      [...subscribers].sort(
        (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
      ),
    [subscribers]
  );

  const createSubscriber = (value) => ({
    email: value.trim().toLowerCase(),
    subscribedAt: new Date().toISOString(),
  });

  const handleSubscribe = async (event) => {
    event.preventDefault();
    const input = email.trim().toLowerCase();

    if (!isEmailValid(input)) {
      setStatus({ type: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }

    const isDuplicated = subscribers.some((subscriber) => subscriber.email === input);
    if (isDuplicated) {
      setStatus({ type: 'error', message: '이미 등록된 이메일입니다.' });
      return;
    }

    const nextSubscribers = [createSubscriber(input), ...subscribers];
    const newSubscriber = nextSubscribers[0];
    setSubscribers(nextSubscribers);
    saveSubscribers(nextSubscribers);
    await syncSubscriberToServer(newSubscriber);
    setEmail('');
    setStatus({
      type: 'success',
      message:
        '구독이 완료되었습니다. 등록된 이메일은 아래 목록에서 확인할 수 있고, 백엔드 연동 시 실제 뉴스레터 발송 대상이 됩니다.',
    });
  };

  if (page === 'subscribe') {
    return (
      <div className="page-wrap">
        <main className="container subscribe-layout">
          <section className="card">
            <button type="button" className="text-button" onClick={() => setPage('home')}>
              ← 메인으로 돌아가기
            </button>
            <h1>바이브코딩 스터디 뉴스레터 구독</h1>
            <p className="description">
              이메일을 등록하면 뉴스레터 발송 대상 리스트에 추가됩니다.
            </p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <label htmlFor="email" className="label">
                이메일 주소
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <button type="submit">뉴스레터 구독하기</button>
            </form>
            {status.message && (
              <p className={`status ${status.type === 'error' ? 'error' : 'success'}`}>
                {status.message}
              </p>
            )}
          </section>

          <section className="card">
            <h2>등록된 이메일 리스트</h2>
            <p className="description">
              운영자가 실제 구독 대상을 확인하는 영역입니다. 현재 총 {sortedSubscribers.length}
              명이 등록되어 있습니다.
            </p>
            {sortedSubscribers.length === 0 ? (
              <p className="empty">아직 등록된 이메일이 없습니다.</p>
            ) : (
              <ul className="email-list">
                {sortedSubscribers.map((subscriber) => (
                  <li key={subscriber.email}>
                    <strong>{subscriber.email}</strong>
                    <span>{new Date(subscriber.subscribedAt).toLocaleString('ko-KR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <main className="container home-layout">
        <section className="hero-card">
          <p className="eyebrow">VIBE CODING STUDY</p>
          <h1>바이브코딩 스터디 뉴스레터</h1>
          <p className="description">
            바이브 코딩, 어떻게 시작할지 모르겠나요? 8주 만에 서비스를 뽑아내는 AI 코딩 레시피를 매주 메일로 보내드립니다.
          </p>
          <button type="button" className="primary-button" onClick={() => setPage('subscribe')}>
            지금 뉴스레터받기
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
