import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Mail, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';
import './App.css';

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vibecoding-newsletter-subscribers';
const SUBSCRIBER_TABLE = 'subscribers';

const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
};

const saveLocal = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

const normalise = (row) => ({
  email: row.email,
  subscribedAt: row.created_at ?? row.subscribedAt ?? new Date().toISOString(),
});

// ─── Confetti burst ───────────────────────────────────────────────────────────

function fireConfetti() {
  const colors = ['#1C1C1C', '#555555', '#999999', '#CCCCCC', '#F0EDE8'];

  confetti({ particleCount: 100, spread: 70, origin: { y: 0.55 }, colors, ticks: 320 });

  setTimeout(() => {
    confetti({ particleCount: 55, angle: 58, spread: 52, origin: { x: 0, y: 0.6 }, colors, ticks: 280 });
    confetti({ particleCount: 55, angle: 122, spread: 52, origin: { x: 1, y: 0.6 }, colors, ticks: 280 });
  }, 180);
}

// ─── Floating side cards ──────────────────────────────────────────────────────

function TipCard() {
  return (
    <motion.div
      className="w-52 rounded-2xl border border-[#E5E3DE] bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1C1C1C] text-white">
          <Zap size={11} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999]">
          Vibe Tip
        </span>
      </div>
      <p className="text-[13px] font-medium leading-snug text-[#1C1C1C]">
        코드 작성 전 Syna로<br />
        기획 정합성을 먼저<br />
        확인하세요.
      </p>
    </motion.div>
  );
}

function PromptBadge() {
  return (
    <motion.div
      className="w-48 rounded-2xl border border-[#E5E3DE] bg-[#F7F5F0] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    >
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#555]">
        ✦ 최신 프롬프트
      </p>
      <p className="mt-1 text-center text-[10px] text-[#999]">
        GPT-4o · Claude 3.7 최적화
      </p>
    </motion.div>
  );
}

function SynaGraph() {
  return (
    <motion.div
      className="w-48 rounded-2xl border border-[#E5E3DE] bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
    >
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#999]">
        Syna Graph
      </p>
      <svg viewBox="0 0 120 80" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="40" r="8" fill="#1C1C1C" />
        <circle cx="60" cy="16" r="5" fill="#999" />
        <circle cx="60" cy="64" r="5" fill="#999" />
        <circle cx="102" cy="40" r="8" fill="#1C1C1C" />
        <circle cx="60" cy="40" r="4" fill="#CCC" />
        <line x1="26" y1="37" x2="55" y2="19" stroke="#E5E3DE" strokeWidth="1.5" />
        <line x1="26" y1="43" x2="55" y2="61" stroke="#E5E3DE" strokeWidth="1.5" />
        <line x1="65" y1="19" x2="94" y2="37" stroke="#E5E3DE" strokeWidth="1.5" />
        <line x1="65" y1="61" x2="94" y2="43" stroke="#E5E3DE" strokeWidth="1.5" />
        <line x1="26" y1="40" x2="56" y2="40" stroke="#DDD" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="64" y1="40" x2="94" y2="40" stroke="#DDD" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <p className="mt-1.5 text-center text-[10px] text-[#999]">기획 → 개발 → 출시</p>
    </motion.div>
  );
}

function WeekBadge() {
  return (
    <motion.div
      className="w-36 rounded-2xl border border-[#1C1C1C] bg-[#1C1C1C] px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    >
      <p className="text-center text-sm font-bold text-white">8 Weeks</p>
      <p className="mt-0.5 text-center text-[10px] text-[#888]">Idea → MVP → Launch</p>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [success, setSuccess] = useState(false);

  // Subtle mouse-parallax for floating cards
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 25, damping: 18 });
  const py = useSpring(my, { stiffness: 25, damping: 18 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set(((e.clientX / window.innerWidth) - 0.5) * 12);
      my.set(((e.clientY / window.innerHeight) - 0.5) * 10);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Hydrate subscriber list
  useEffect(() => {
    const hydrate = async () => {
      const local = loadLocal();
      if (!isSupabaseConfigured || !supabase) { setSubscribers(local); return; }

      const { data, error } = await supabase
        .from(SUBSCRIBER_TABLE)
        .select('email, created_at')
        .order('created_at', { ascending: false });

      if (error) { setSubscribers(local); }
      else {
        const remote = (data ?? []).map(normalise);
        setSubscribers(remote);
        saveLocal(remote);
      }
    };
    hydrate();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const input = email.trim().toLowerCase();

    if (!isEmailValid(input)) {
      setStatus({ type: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }
    if (subscribers.some((s) => s.email === input)) {
      setStatus({ type: 'error', message: '이미 등록된 이메일입니다.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await new Promise((r) => setTimeout(r, 700));

      let finalSub = { email: input, subscribedAt: new Date().toISOString() };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from(SUBSCRIBER_TABLE)
          .insert({ email: input })
          .select('email, created_at')
          .single();

        if (error) {
          setStatus({ type: 'error', message: 'Supabase 저장 실패. 테이블/RLS 설정을 확인해주세요.' });
          return;
        }
        finalSub = normalise(data);
      }

      const next = [finalSub, ...subscribers];
      setSubscribers(next);
      saveLocal(next);
      setEmail('');
      setSuccess(true);
      setStatus({ type: 'success', message: '구독이 완료되었습니다! 다음 뉴스레터부터 받아보실 수 있어요.' });
      fireConfetti();
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF9F6]">

      {/* ── Floating left ──────────────────────────────── */}
      <div className="pointer-events-none fixed left-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-start gap-5 xl:flex">
        <motion.div style={{ x: px, y: py }}><TipCard /></motion.div>
        <motion.div style={{ x: px, y: py }}><PromptBadge /></motion.div>
      </div>

      {/* ── Floating right ─────────────────────────────── */}
      <div className="pointer-events-none fixed right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex">
        <motion.div style={{ x: px, y: py }}><SynaGraph /></motion.div>
        <motion.div style={{ x: px, y: py }}><WeekBadge /></motion.div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="mx-auto max-w-[560px] px-6 py-24">

        {/* Brand */}
        <motion.p
          className="mb-14 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Vibe Coding Study
        </motion.p>

        {/* Hero */}
        <motion.section
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-[2.4rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#1C1C1C] md:text-[2.9rem]">
            AI와 함께 8주 만에<br />제품을 뽑아내는 방법
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-[#777]">
            바이브 코딩과 제품 정합성 관리(Syna)의<br />
            모든 노하우를 매주 메일로 보내드립니다.
          </p>
        </motion.section>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubscribe} className="space-y-2.5">
            {/* Email input */}
            <motion.div
              className="rounded-xl border bg-white"
              animate={{
                borderColor: isEmailFocused ? '#1C1C1C' : '#E5E3DE',
                boxShadow: isEmailFocused
                  ? '0 0 0 4px rgba(28,28,28,0.07)'
                  : '0 0 0 0px rgba(28,28,28,0)',
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Mail size={17} className="shrink-0 text-[#BBBBBB]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => { setIsEmailFocused(true); setStatus({ type: '', message: '' }); }}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none placeholder:text-[#CCC]"
                  autoComplete="email"
                  required
                />
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#1C1C1C] py-4 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {/* FREE badge — top-right corner */}
              {!success && !isSubmitting && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                  무료
                </span>
              )}

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    🎉 구독 완료!
                  </motion.span>
                ) : isSubmitting ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    처리 중...
                  </motion.span>
                ) : (
                  <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    구독하기 <ArrowRight size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Status message */}
          <AnimatePresence>
            {status.message && (
              <motion.p
                key={status.message}
                className={`mt-3 text-center text-[13px] ${
                  status.type === 'success' ? 'text-[#1C1C1C]' : 'text-red-500'
                }`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {status.message}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="mt-4 text-center text-[11px] text-[#C0BDB8]">
            스팸 없음 &nbsp;·&nbsp; 언제든 구독 해지 가능
          </p>
        </motion.section>

        {/* Divider */}
        <div className="my-16 border-t border-[#E9E7E2]" />

        {/* Subscriber count */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[2.2rem] font-bold tracking-tight text-[#1C1C1C]">
            {subscribers.length}
          </p>
          <p className="mt-1 text-[13px] text-[#999]">명이 함께하고 있습니다</p>
        </motion.section>
      </div>
    </div>
  );
}
