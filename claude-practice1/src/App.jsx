import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Mail, Sparkles, Zap } from 'lucide-react';
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

// ─── Confetti ─────────────────────────────────────────────────────────────────

function fireConfetti() {
  const fire = (ratio, opts) =>
    confetti({ origin: { y: 0.52 }, particleCount: Math.floor(180 * ratio), zIndex: 9999, ...opts });

  fire(0.30, { spread: 26,  startVelocity: 60,                           colors: ['#3182F6', '#5BA4F7', '#93C5FD'] });
  fire(0.20, { spread: 60,                                                colors: ['#191f28', '#4E5968', '#8B95A1'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8,                    colors: ['#F2F4F6', '#E2E8F0', '#CBD5E0'] });
  fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#3182F6', '#ffffff'] });
  fire(0.10, { spread: 120, startVelocity: 45,                           colors: ['#3182F6', '#191f28'] });
}

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 36 } },
};
const stagger = { show: { transition: { staggerChildren: 0.09 } } };

// ─── Toss Checkbox ────────────────────────────────────────────────────────────

function TossCheckbox({ checked, onChange, label, tag, tagColor }) {
  return (
    <motion.div
      className="flex cursor-pointer items-center gap-3"
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.97 }}
    >
      {/* Box */}
      <motion.div
        className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px]"
        animate={{ backgroundColor: checked ? '#3182F6' : '#E8EAED' }}
        transition={{ duration: 0.14 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <Check size={13} strokeWidth={3} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <p className="select-none text-[13px] font-medium text-[#6B7684]">
        <span className="mr-1 font-bold" style={{ color: tagColor }}>
          {tag}
        </span>
        {label}
      </p>
    </motion.div>
  );
}

// ─── Floating Glass Cards ─────────────────────────────────────────────────────

function GlassCard({ children, className = '', floatDelay = 0, floatDuration = 4.5 }) {
  return (
    <motion.div
      className={`rounded-[20px] border border-white/70 bg-white/75 shadow-[0_12px_40px_rgba(0,0,0,0.10)] backdrop-blur-2xl ${className}`}
      animate={{ y: [0, -11, 0] }}
      transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
    >
      {children}
    </motion.div>
  );
}

function VibeTipCard() {
  const steps = [
    { label: '기획', pct: 88, opacity: 1 },
    { label: '개발', pct: 62, opacity: 0.65 },
    { label: '출시', pct: 38, opacity: 0.38 },
  ];
  return (
    <GlassCard className="w-56 p-4" floatDuration={4.8}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#3182F6]">
          <Zap size={13} className="fill-white text-white" />
        </span>
        <span className="text-[11px] font-bold text-[#3182F6]">Vibe Tip</span>
      </div>
      <p className="text-[13px] font-semibold leading-snug text-[#191f28]">
        코드 작성 전 Syna로<br />기획 정합성을 먼저 확인하세요.
      </p>
      <div className="mt-3.5 space-y-2">
        {steps.map(({ label, pct, opacity }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="h-1.5 rounded-full bg-[#3182F6]" style={{ width: `${pct}%`, opacity }} />
            <span className="text-[10px] text-[#8B95A1]">{label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function SynaFlowCard() {
  return (
    <GlassCard className="w-52 p-4" floatDelay={0.9} floatDuration={5.4}>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B95A1]">Syna Flow</p>
      <svg viewBox="0 0 140 90" className="w-full" fill="none">
        <circle cx="20"  cy="45" r="9"   fill="#191f28" />
        <circle cx="70"  cy="16" r="6.5" fill="#3182F6" />
        <circle cx="70"  cy="74" r="6.5" fill="#3182F6" />
        <circle cx="120" cy="45" r="9"   fill="#191f28" />
        <circle cx="70"  cy="45" r="4.5" fill="#CBD5E0" />
        <line x1="29" y1="42" x2="63"  y2="20"  stroke="#CBD5E0" strokeWidth="1.5" />
        <line x1="29" y1="48" x2="63"  y2="70"  stroke="#CBD5E0" strokeWidth="1.5" />
        <line x1="77" y1="20" x2="111" y2="42"  stroke="#CBD5E0" strokeWidth="1.5" />
        <line x1="77" y1="70" x2="111" y2="48"  stroke="#CBD5E0" strokeWidth="1.5" />
        <line x1="29"  y1="45" x2="65"  y2="45" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="75"  y1="45" x2="111" y2="45" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <p className="mt-1.5 text-center text-[10px] text-[#8B95A1]">기획 → 개발 → 출시</p>
    </GlassCard>
  );
}

function WeeklyBadge() {
  return (
    <motion.div
      className="flex w-48 items-center gap-3 rounded-[18px] bg-[#191f28] px-4 py-3.5 shadow-[0_12px_32px_rgba(25,31,40,0.28)]"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    >
      <span className="text-[22px]">📬</span>
      <div>
        <p className="text-[12px] font-bold text-white">매주 목요일</p>
        <p className="text-[10px] text-white/50">오전 8시 정각 발송</p>
      </div>
    </motion.div>
  );
}

function PromptChip() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5"
      style={{ background: 'rgba(49,130,246,0.09)', border: '1px solid rgba(49,130,246,0.22)', backdropFilter: 'blur(12px)' }}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
    >
      <Sparkles size={12} className="text-[#3182F6]" />
      <span className="text-[11px] font-bold text-[#3182F6]">Claude 4 · GPT-4o 최적화</span>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [email, setEmail]           = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 필수
  const [agreeSyna, setAgreeSyna]   = useState(false);     // 선택
  const [status, setStatus]         = useState({ type: '', message: '' });
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [success, setSuccess]       = useState(false);

  const btnControls = useAnimation(); // shake 애니메이션용

  // 전체 동의 상태
  const allAgreed = agreePrivacy && agreeSyna;
  const toggleAll = () => {
    const next = !allAgreed;
    setAgreePrivacy(next);
    setAgreeSyna(next);
  };

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px  = useSpring(mx, { stiffness: 28, damping: 20 });
  const py  = useSpring(my, { stiffness: 28, damping: 20 });
  const px2 = useSpring(mx, { stiffness: 18, damping: 15 });
  const py2 = useSpring(my, { stiffness: 18, damping: 15 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set(((e.clientX / window.innerWidth)  - 0.5) * 18);
      my.set(((e.clientY / window.innerHeight) - 0.5) * 14);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Hydrate subscribers
  useEffect(() => {
    const hydrate = async () => {
      const local = loadLocal();
      if (!isSupabaseConfigured || !supabase) { setSubscribers(local); return; }
      const { data, error } = await supabase
        .from(SUBSCRIBER_TABLE)
        .select('email, created_at')
        .order('created_at', { ascending: false });
      if (error) { setSubscribers(local); }
      else { const r = (data ?? []).map(normalise); setSubscribers(r); saveLocal(r); }
    };
    hydrate();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const input = email.trim().toLowerCase();

    // 이메일 유효성
    if (!isEmailValid(input)) {
      setStatus({ type: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }
    // 필수 동의 검사 → 버튼 shake
    if (!agreePrivacy) {
      setStatus({ type: 'error', message: '개인정보 수집 및 이용에 동의해주세요.' });
      btnControls.start({
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      });
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
          .insert({ email: input, is_syna_interested: agreeSyna })
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
      setAgreePrivacy(false);
      setAgreeSyna(false);
      setSuccess(true);
      setStatus({ type: 'success', message: '구독 완료! 다음 뉴스레터부터 바로 받아보실 수 있어요.' });
      fireConfetti();
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayCount = Math.max(subscribers.length, 100);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#191f28]">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_420px] lg:gap-0 lg:px-14">

        {/* ═══ LEFT ══════════════════════════════════════════════ */}
        <motion.div className="w-full max-w-lg" initial="hidden" animate="show" variants={stagger}>

          {/* Brand chip */}
          <motion.div variants={fadeUp} className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F2F4F6] px-4 py-2 text-[12px] font-semibold text-[#4E5968]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3182F6]" />
              VIBE CODING STUDY
            </span>
          </motion.div>

          {/* Hero */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[3rem] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#191f28] md:text-[3.8rem]">
              코딩하지 마세요,<br />
              <span className="text-[#3182F6]">바이브</span>하세요.
            </h1>
            <p className="mt-5 max-w-[400px] text-[15px] font-medium leading-[1.75] text-[#6B7684]">
              Cursor와 AI로 8주 만에 제품을 런칭하는<br />
              실전 워크플로우를 매주 메일로 전달합니다.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubscribe} className="mt-10 space-y-2.5" variants={fadeUp}>

            {/* Email input */}
            <motion.div
              className="flex cursor-text items-center gap-3 rounded-2xl px-5 py-[17px]"
              animate={{ background: isEmailFocused ? '#EAECEF' : '#F2F4F6' }}
              transition={{ duration: 0.14 }}
            >
              <Mail size={18} className="shrink-0 text-[#B0B8C1]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => { setIsEmailFocused(true); setStatus({ type: '', message: '' }); }}
                onBlur={() => setIsEmailFocused(false)}
                placeholder="이메일 주소를 입력해주세요"
                className="w-full bg-transparent text-[15px] font-medium text-[#191f28] outline-none placeholder:text-[#B0B8C1]"
                autoComplete="email"
                required
              />
            </motion.div>

            {/* ── Consent group ────────────────────────────────── */}
            <div className="rounded-2xl bg-[#F8F9FA] px-5 py-4 space-y-3">

              {/* 전체 동의 */}
              <motion.div
                className="flex cursor-pointer items-center justify-between pb-3 border-b border-[#E8EAED]"
                onClick={toggleAll}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-[14px] font-bold text-[#191f28]">전체 동의하기</span>
                <motion.div
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
                  animate={{ backgroundColor: allAgreed ? '#3182F6' : '#E8EAED' }}
                  transition={{ duration: 0.14 }}
                >
                  <AnimatePresence>
                    {allAgreed && (
                      <motion.div
                        key="all-check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      >
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* 개별 항목 */}
              <TossCheckbox
                checked={agreePrivacy}
                onChange={setAgreePrivacy}
                tag="(필수)"
                tagColor="#3182F6"
                label="개인정보 수집 및 이용에 동의합니다."
              />
              <TossCheckbox
                checked={agreeSyna}
                onChange={setAgreeSyna}
                tag="(선택)"
                tagColor="#B0B8C1"
                label="광고성 정보 수신에 동의합니다."
              />

              {/* 선택 항목 설명 */}
              <p className="pl-[34px] text-[11px] leading-relaxed text-[#B0B8C1]">
                Syna 관련 신규 소식 및 업데이트를 받아보실 수 있어요.
              </p>
            </div>

            {/* CTA 버튼 — 파란색 */}
            <motion.div animate={btnControls}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.012 } : {}}
                whileTap={!isSubmitting ? { scale: 0.978 } : {}}
                className="relative w-full overflow-hidden rounded-2xl bg-[#3182F6] py-[17px] text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.span
                      key="done"
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      <CheckCircle2 size={17} />
                      구독 완료!
                    </motion.span>
                  ) : isSubmitting ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      처리 중…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="flex items-center justify-center gap-2.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      무료로 구독하기
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold tracking-widest text-white/90">
                        FREE
                      </span>
                      <ArrowRight size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Status */}
          <AnimatePresence>
            {status.message && (
              <motion.p
                key={status.message}
                className={`mt-3 text-[13px] font-semibold ${
                  status.type === 'success' ? 'text-[#3182F6]' : 'text-[#F04452]'
                }`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {status.message}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="mt-3 text-[12px] text-[#B0B8C1]">스팸 없음 · 언제든 구독 해지 가능</p>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <div className="flex -space-x-2">
              {['#3182F6', '#191f28', '#8B95A1', '#4E5968', '#CBD5E0'].map((bg, i) => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-white" style={{ background: bg }} />
              ))}
            </div>
            <p className="text-[13px] font-medium text-[#6B7684]">
              이미{' '}
              <span className="font-bold text-[#191f28]">아주대 창업팀</span>과{' '}
              <span className="font-bold text-[#191f28]">{displayCount}명</span>의 개발자가
              함께하고 있습니다.
            </p>
          </motion.div>
        </motion.div>

        {/* ═══ RIGHT: Floating cards ══════════════════════════════ */}
        <div className="relative hidden h-[540px] select-none lg:block">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: 'rgba(49,130,246,0.07)' }} />
          <div className="pointer-events-none absolute right-6 top-10 h-48 w-48 rounded-full blur-2xl" style={{ background: 'rgba(25,31,40,0.05)' }} />

          <motion.div className="absolute left-6 top-4"   style={{ x: px2, y: py2 }}><VibeTipCard /></motion.div>
          <motion.div className="absolute right-2 top-20"  style={{ x: px,  y: py  }}><WeeklyBadge /></motion.div>
          <motion.div className="absolute bottom-20 left-2" style={{ x: px,  y: py  }}><SynaFlowCard /></motion.div>
          <motion.div className="absolute bottom-8 right-4" style={{ x: px2, y: py2 }}><PromptChip /></motion.div>
        </div>
      </div>
    </div>
  );
}
