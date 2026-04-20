import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Sparkles, Gift } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';
import './App.css';

const STORAGE_KEY = 'vibecoding-newsletter-subscribers';
const SUBSCRIBER_TABLE = 'newsletter_subscribers';

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

const normalizeSubscriber = (row) => ({
  email: row.email,
  subscribedAt: row.created_at ?? row.subscribedAt ?? new Date().toISOString(),
});

const heroText = 'AI 시대의 제품 제작기, 매주 뉴스레터로 받아보세요';

const leadMagnets = [
  {
    title: 'Vibe 프롬프트 모음집',
    description: '최신 모델 최적화',
  },
  {
    title: 'Next.js + Supabase 템플릿 코드',
    description: '바로 복제 가능한 실전 베이스',
  },
  {
    title: '기획 정합성 관리 리포트 (Syna 프리뷰)',
    description: '아이디어부터 릴리즈까지 흐름 점검',
  },
];

const balloonTracks = [
  { left: '8%', color: '#7db7ff', delay: 0 },
  { left: '22%', color: '#5f8bff', delay: 0.1 },
  { left: '36%', color: '#8ad0ff', delay: 0.2 },
  { left: '50%', color: '#9a7bff', delay: 0.05 },
  { left: '64%', color: '#5f8bff', delay: 0.22 },
  { left: '78%', color: '#7db7ff', delay: 0.15 },
  { left: '90%', color: '#8ad0ff', delay: 0.28 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function App() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(true);
  const [dataSource, setDataSource] = useState('local');

  useEffect(() => {
    const hydrateSubscribers = async () => {
      const localSubscribers = loadSubscribers();

      if (!isSupabaseConfigured || !supabase) {
        setSubscribers(localSubscribers);
        setDataSource('local');
        setIsFetchingSubscribers(false);
        return;
      }

      const { data, error } = await supabase
        .from(SUBSCRIBER_TABLE)
        .select('email, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        setSubscribers(localSubscribers);
        setDataSource('local');
        setStatus({
          type: 'error',
          message:
            'Supabase에서 구독자 목록을 불러오지 못해 로컬 목록을 표시합니다. 테이블/권한 설정을 확인해주세요.',
        });
      } else {
        const remoteSubscribers = (data ?? []).map(normalizeSubscriber);
        setSubscribers(remoteSubscribers);
        saveSubscribers(remoteSubscribers);
        setDataSource('supabase');
      }

      setIsFetchingSubscribers(false);
    };

    hydrateSubscribers();
  }, []);

  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.1);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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

  const syncSubscriberToServer = async (subscriber) => {
    if (!isSupabaseConfigured || !supabase) return { row: subscriber, error: null };

    const { data, error } = await supabase
      .from(SUBSCRIBER_TABLE)
      .insert({ email: subscriber.email })
      .select('email, created_at')
      .single();

    if (error) return { row: null, error };
    return { row: normalizeSubscriber(data), error: null };
  };

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

    setIsSubmitting(true);
    const newSubscriber = createSubscriber(input);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const { row, error } = await syncSubscriberToServer(newSubscriber);
      if (error) {
        setStatus({
          type: 'error',
          message:
            'Supabase 저장에 실패했습니다. 테이블 이름/권한(RLS) 설정을 확인한 뒤 다시 시도해주세요.',
        });
        return;
      }

      const finalSubscriber = row ?? newSubscriber;
      const nextSubscribers = [finalSubscriber, ...subscribers];
      setSubscribers(nextSubscribers);
      saveSubscribers(nextSubscribers);
      const savedToSupabase = Boolean(row) && isSupabaseConfigured;
      setDataSource(savedToSupabase ? 'supabase' : 'local');
      setEmail('');
      setNickname('');
      setStatus({
        type: 'success',
        message: savedToSupabase
          ? '구독이 완료되었습니다. Supabase에 저장되었고 다음 뉴스레터부터 바로 받아볼 수 있습니다.'
          : '구독이 완료되었습니다. 로컬에 저장되었고 Supabase 연결 후 자동 동기화할 수 있습니다.',
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#eaf2ff] via-[#f8fbff] to-[#ffffff] text-[#111111]">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10">
        <motion.header
          className="mb-12 flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-sm font-semibold tracking-[0.2em] text-[#2f5eff]">BCUBE-VIBESTUDY</div>
          <div className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-medium text-[#4571ff]">
            Toss-style Newsletter
          </div>
        </motion.header>

        <main className="space-y-12">
          <motion.section
            className="relative overflow-hidden rounded-[34px] border border-[#d6e6ff] bg-white p-8 shadow-[0_18px_40px_rgba(62,117,255,0.15)] md:p-12"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            style={{ y: -parallaxY }}
          >
            <div className="pointer-events-none absolute -right-14 top-0 h-52 w-52 rounded-full bg-[#d9e6ff]" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-[#dceeff]" />
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-[#edf3ff] px-4 py-2 text-xs font-semibold tracking-wide text-[#2f5eff]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={14} />
              VIBE LETTER
            </motion.div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#18346a] md:text-6xl">
              {heroText.split('').map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.024 * index, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4f6ea6]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.65 }}
            >
              매주 목요일 오전 8시, 바이브 코딩 실전 사례와 워크플로우를 한 장의 메일로 전달합니다.
            </motion.p>
          </motion.section>

          <motion.section
            className="relative overflow-hidden rounded-[34px] border border-[#bfd4ff] bg-gradient-to-br from-[#2962ff] via-[#3a80ff] to-[#5871ff] p-8 text-white shadow-[0_28px_60px_rgba(44,106,255,0.38)] md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="pointer-events-none absolute -left-14 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-white/20" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#a7b8ff]/45" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e5ecff]">
                  Subscription Form
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  뉴스레터를 받아보실
                  <br />
                  이메일을 남겨주세요
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#e8eeff]">
                  디자인, 빌드, 제품 운영 인사이트를 큐레이션해서 보내드립니다.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {leadMagnets.map((item) => (
                    <motion.div
                      key={item.title}
                      className="rounded-2xl border border-white/35 bg-white/20 px-4 py-3 text-sm backdrop-blur-sm"
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                    >
                      <div className="mb-2 inline-flex rounded-full bg-white/30 p-1.5">
                        <Gift size={14} />
                      </div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-[#e8eeff]">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.form
                onSubmit={handleSubscribe}
                className="rounded-3xl border border-white/40 bg-white/18 p-4 backdrop-blur-md md:p-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <label className="mb-2 block text-sm font-semibold text-white/95">구독자 닉네임</label>
                <motion.div
                  className="rounded-2xl border border-transparent bg-white p-1"
                  animate={{
                    boxShadow: isInputFocused
                      ? '0 0 0 8px rgba(255,255,255,0.30)'
                      : '0 0 0 0 rgba(255,255,255,0)',
                  }}
                  transition={{ duration: 0.24 }}
                >
                  <input
                    type="text"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="예: 바이브러버"
                    className="w-full rounded-xl border border-[#d7e3ff] px-4 py-3 text-base font-medium text-[#244079] outline-none placeholder:text-[#8ca2d3]"
                  />
                </motion.div>

                <label className="mb-2 mt-4 block text-sm font-semibold text-white/95">이메일 주소</label>
                <motion.div
                  className="rounded-2xl border border-transparent bg-white p-1"
                  animate={{
                    boxShadow: isInputFocused
                      ? '0 0 0 8px rgba(255,255,255,0.30)'
                      : '0 0 0 0 rgba(255,255,255,0)',
                  }}
                  transition={{ duration: 0.24 }}
                >
                  <div className="flex items-center gap-3 rounded-xl border border-[#d7e3ff] bg-white px-4 py-3">
                    <Mail size={20} className="text-[#4f77ff]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent text-base font-medium text-[#244079] outline-none placeholder:text-[#8ca2d3]"
                      autoComplete="email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full rounded-2xl bg-[#13254d] px-8 py-4 text-base font-semibold text-white shadow-[0_12px_24px_rgba(8,22,52,0.38)] disabled:cursor-not-allowed disabled:bg-[#6f7da3]"
                >
                  {isSubmitting ? '구독 중...' : '구독하기'}
                </motion.button>
              </motion.form>
            </div>

            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(22)].map((_, index) => (
                    <motion.span
                      // eslint-disable-next-line react/no-array-index-key
                      key={`firework-${index}`}
                      className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: ['#ffffff', '#c7d9ff', '#8ec4ff', '#ffd5f5'][index % 4] }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((index / 22) * Math.PI * 2) * 210,
                        y: Math.sin((index / 22) * Math.PI * 2) * 160,
                        opacity: 0,
                        scale: 0.2,
                      }}
                      transition={{ duration: 0.95, ease: 'easeOut' }}
                    />
                  ))}

                  {balloonTracks.map((balloon) => (
                    <motion.div
                      key={balloon.left}
                      className="absolute bottom-[-80px]"
                      style={{ left: balloon.left }}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -420, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.1, delay: balloon.delay, ease: 'easeOut' }}
                    >
                      <div
                        className="relative h-14 w-11 rounded-[999px]"
                        style={{ backgroundColor: balloon.color }}
                      >
                        <span className="absolute left-1/2 top-[56px] h-10 w-[1.5px] -translate-x-1/2 bg-white/85" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {status.message && (
              <p
                className={`mt-4 text-sm font-semibold ${
                  status.type === 'success' ? 'text-[#e9ffef]' : 'text-[#ffe6ea]'
                }`}
              >
                {status.message}
              </p>
            )}
          </motion.section>

          <motion.section
            className="rounded-3xl border border-[#dce8ff] bg-white p-7 shadow-[0_16px_35px_rgba(60,120,255,0.1)] md:p-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#5f82de]">Audience</p>
                <p className="mt-2 text-4xl font-bold text-[#1f3366]">{sortedSubscribers.length}</p>
                <p className="text-sm text-[#6b82b8]">누적 구독 이메일 수</p>
              </div>
              <p className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#4268d6]">
                DATA: {dataSource === 'supabase' ? 'SUPABASE' : 'LOCAL'}
              </p>
            </div>
            <div className="rounded-2xl border border-[#dce8ff] bg-gradient-to-b from-[#f7faff] to-[#ffffff] p-4">
              <p className="mb-3 text-sm font-semibold text-[#2b478f]">구독자 이메일</p>
              {isFetchingSubscribers ? (
                <p className="text-sm text-[#7f92bf]">불러오는 중...</p>
              ) : sortedSubscribers.length === 0 ? (
                <p className="text-sm text-[#7f92bf]">아직 등록된 이메일이 없습니다.</p>
              ) : (
                <ul className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm text-[#2c4275]">
                  {sortedSubscribers.slice(0, 12).map((subscriber) => (
                    <li
                      key={subscriber.email}
                      className="rounded-xl border border-[#d9e5ff] bg-white px-3 py-2"
                    >
                      <p className="font-semibold">{subscriber.email}</p>
                      <p className="mt-1 text-xs text-[#7a8fbf]">
                        {new Date(subscriber.subscribedAt).toLocaleString('ko-KR')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

export default App;
