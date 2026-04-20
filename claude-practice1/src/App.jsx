import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Sparkles, Gift } from 'lucide-react';
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

const testimonials = [
  {
    name: '민수 / PM',
    quote: '매주 오는 워크플로우를 그대로 적용했더니 아이디어 검증 속도가 정말 빨라졌어요.',
  },
  {
    name: '지연 / 프론트엔드',
    quote: '뉴스레터 템플릿 하나로 기획-개발 핸드오프가 깔끔해져서 팀 스트레스가 줄었습니다.',
  },
  {
    name: '도윤 / 창업 준비',
    quote: '8주 로드맵이 명확해서 혼자 만들 때 막히던 구간을 빠르게 넘길 수 있었어요.',
  },
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
  const [status, setStatus] = useState({ type: '', message: '' });
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    setSubscribers(loadSubscribers());
  }, []);

  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.1);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4300);
    return () => clearInterval(timer);
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
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriber),
      });
    } catch {
      // Next.js API 또는 Supabase 미연동 상태에서도 수집 기능을 유지한다.
    }
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
    const nextSubscribers = [createSubscriber(input), ...subscribers];
    const newSubscriber = nextSubscribers[0];
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setSubscribers(nextSubscribers);
      saveSubscribers(nextSubscribers);
      await syncSubscriberToServer(newSubscriber);
      setEmail('');
      setStatus({
        type: 'success',
        message: '구독이 완료되었습니다. 다음 뉴스레터부터 바로 받아볼 수 있습니다.',
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f8f8] text-[#111111]">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:px-10">
        <motion.header
          className="mb-16 flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-sm tracking-[0.28em] text-[#666666]">BCUBE-VIBESTUDY</div>
          <div className="rounded-full border border-[#d7d7d7] px-4 py-2 text-xs text-[#666666]">
            Weekly Builder Letter
          </div>
        </motion.header>

        <main className="space-y-28">
          <motion.section
            className="relative"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            style={{ y: -parallaxY }}
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6d6d6] px-4 py-2 text-xs text-[#4d4d4d]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles size={14} />
              2026 Vibe Coding Digest
            </motion.div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {heroText.split('').map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.03 * index,
                    duration: 0.52,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="mt-7 max-w-3xl text-lg text-[#5a5a5a]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              Cursor + Opus 4.7로 8주 만에 서비스를 뽑아내는 Vibe Workflow 레시피를 공유합니다.
            </motion.p>
          </motion.section>

          <motion.section
            className="grid gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {leadMagnets.map((item, index) => (
              <motion.article
                key={item.title}
                className="group rounded-2xl border border-[#dedede] bg-[#ffffff] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.04)]"
                variants={sectionVariants}
                whileHover={{ y: -8, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <div className="mb-4 inline-flex rounded-full border border-[#d8d8d8] p-2 text-[#333333]">
                  <Gift size={16} />
                </div>
                <h2 className="text-xl font-medium tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6a6a6a]">{item.description}</p>
              </motion.article>
            ))}
          </motion.section>

          <motion.section
            className="relative overflow-hidden rounded-3xl border border-[#dedede] bg-white p-7 md:p-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[#ececec] blur-3xl" />
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              메일로 받는 실전 빌드 플로우
            </h3>
            <p className="mt-4 text-[#626262]">
              매주 1회, 실전에 바로 적용 가능한 프롬프트/기획/개발 운영 노트를 압축해서 전달합니다.
            </p>

            <motion.form
              onSubmit={handleSubscribe}
              className="relative mt-8 flex flex-col gap-3 md:flex-row"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex-1 rounded-2xl border border-[#d8d8d8] bg-[#fafafa] p-1"
                animate={{
                  boxShadow: isInputFocused
                    ? '0 0 0 6px rgba(17,17,17,0.08)'
                    : '0 0 0 0 rgba(17,17,17,0)',
                }}
                transition={{ duration: 0.28 }}
              >
                <div className="flex items-center gap-3 rounded-xl border border-transparent bg-white px-4 py-3">
                  <Mail size={18} className="text-[#808080]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#9d9d9d]"
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
                className="rounded-2xl bg-[#111111] px-8 py-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-[#666666]"
              >
                {isSubmitting ? '구독 중...' : '구독하기'}
              </motion.button>
            </motion.form>

            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(16)].map((_, index) => (
                    <motion.span
                      // eslint-disable-next-line react/no-array-index-key
                      key={`confetti-${index}`}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#111111]"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((index / 16) * Math.PI * 2) * 180,
                        y: Math.sin((index / 16) * Math.PI * 2) * 140,
                        opacity: 0,
                        scale: 0.25,
                      }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {status.message && (
              <p
                className={`mt-4 text-sm ${
                  status.type === 'success' ? 'text-[#1f7a35]' : 'text-[#b3261e]'
                }`}
              >
                {status.message}
              </p>
            )}
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="rounded-3xl border border-[#e0e0e0] bg-white p-7 md:p-10">
              <p className="text-xs uppercase tracking-[0.24em] text-[#6f6f6f]">Testimonial</p>
              <div className="mt-6 h-[145px]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={testimonials[activeTestimonial].name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.55 }}
                    className="text-xl leading-relaxed tracking-tight text-[#191919]"
                  >
                    "{testimonials[activeTestimonial].quote}"
                    <footer className="mt-6 text-sm text-[#686868]">
                      {testimonials[activeTestimonial].name}
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              className="rounded-3xl border border-[#e0e0e0] bg-[#111111] p-7 text-white md:p-10"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#b4b4b4]">Audience</p>
              <p className="mt-3 text-4xl font-semibold">{sortedSubscribers.length}</p>
              <p className="mt-2 text-sm text-[#d0d0d0]">누적 구독 이메일 수</p>
              <p className="mt-8 text-sm leading-relaxed text-[#c9c9c9]">
                저장된 이메일은 브라우저에 보관되며, `/api/newsletter/subscribe` API를 연결하면
                Supabase 또는 Vercel Postgres에 실시간 저장할 수 있습니다.
              </p>
            </motion.div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

export default App;
