// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Wallet,
  Lock,
  ShieldCheck,
  MessageSquare,
  Send,
  Sparkles,
  Coins,
  Sun,
  Moon,
  ChevronDown,
  ChevronDownCircle,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";

/* === i18n === */
import { createI18n, type Lang } from "./i18n";

/** Pure UI helper */
export function computeCanSubmit(
  address: unknown,
  contact: unknown,
  agree: unknown
): boolean {
  const a = typeof address === "string" ? address : "";
  const c = typeof contact === "string" ? contact : "";
  const g = typeof agree === "boolean" ? agree : Boolean(agree);
  const isAddressOk = a.trim().length >= 8;
  return isAddressOk && c.trim().length > 2 && g;
}

/** Tiny UI tests (console) */
function runTests() {
  type T = {
    name: string;
    address: any;
    contact: any;
    agree: any;
    expect: boolean;
  };
  const base: T[] = [
    {
      name: "empty fields => false",
      address: "",
      contact: "",
      agree: false,
      expect: false,
    },
    {
      name: "short address => false",
      address: "0x123",
      contact: "@u",
      agree: true,
      expect: false,
    },
    {
      name: "missing contact => false",
      address: "0x12345678",
      contact: "",
      agree: true,
      expect: false,
    },
    {
      name: "not agreed => false",
      address: "0x12345678",
      contact: "@user",
      agree: false,
      expect: false,
    },
    {
      name: "valid => true",
      address: "0x1234567890",
      contact: "@user",
      agree: true,
      expect: true,
    },
  ];
  const more: T[] = [
    {
      name: "address with spaces => true",
      address: "   0x12345678   ",
      contact: "tg:@user",
      agree: true,
      expect: true,
    },
    {
      name: "contact only spaces => false",
      address: "0xabcdef123456",
      contact: "   ",
      agree: true,
      expect: false,
    },
    {
      name: "agree false despite valid fields => false",
      address: "0xabcdef123456",
      contact: "+1-202-555",
      agree: false,
      expect: false,
    },
    {
      name: "address undefined => false (guarded)",
      address: undefined,
      contact: "@u",
      agree: true,
      expect: false,
    },
    {
      name: "contact null => false (guarded)",
      address: "0x12345678",
      contact: null,
      agree: true,
      expect: false,
    },
    {
      name: "agree as truthy string => true (coerced)",
      address: "0x12345678",
      contact: "@u",
      agree: "yes",
      expect: true,
    },
  ];
  const cases: T[] = [...base, ...more];

  const results = cases.map((c) => ({
    name: c.name,
    got: computeCanSubmit(c.address, c.contact, c.agree),
    expect: c.expect,
  }));
  const failed = results.filter((r) => r.got !== r.expect);
  // eslint-disable-next-line no-console
  console.group("WalletBuyBack UI tests");
  results.forEach((r) =>
    console[r.got === r.expect ? "log" : "error"](
      `${r.name}: got ${r.got}, expect ${r.expect}`
    )
  );
  console.log(
    failed.length === 0 ? "All tests passed" : `${failed.length} test(s) failed`
  );
  console.groupEnd();
}
if (typeof window !== "undefined") {
  try {
    runTests();
  } catch {}
}

/** Brands */
const BRAND_COLORS = {
  metamask: "#F6851B",
  phantom: "#5341F5",
  trust: "#3375BB",
} as const;
const BRAND_SVGS = {
  metamask: "/MetaMask-icon-fox.svg",
  phantom: "/Phantom_SVG_Icon.svg",
  trust: "/Trust_Stacked Logo_Blue.svg",
} as const;

/* === i18n: autodetect & persist === */
function mapToLang(code: string): Lang {
  const c = code?.toLowerCase?.() || "";
  if (c.startsWith("ru")) return "ru";
  if (c.startsWith("zh")) return "zh";
  if (c.startsWith("hi")) return "hi";
  if (c.startsWith("id") || c.startsWith("in")) return "id";
  if (c.startsWith("en")) return "en";
  return "en";
}
function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored) return stored as Lang;
  } catch {}
  const prefs = (
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]
  ).filter(Boolean) as string[];
  for (const code of prefs) {
    const mapped = mapToLang(code);
    if (mapped) return mapped;
  }
  return "en";
}

/** Background */
function CryptoBackground({ theme }: { theme: "light" | "dark" }) {
  const { scrollY } = useScroll();
  const yGlows = useTransform(scrollY, [0, 800], [0, -80]);
  const yGrid = useTransform(scrollY, [0, 800], [0, -40]);
  const isDark = theme === "dark";
  const glowTeal = isDark ? "bg-teal-400/20" : "bg-teal-100";
  const glowSky = isDark ? "bg-sky-400/20" : "bg-sky-100";
  const glowAmber = isDark ? "bg-amber-400/20" : "bg-amber-100";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={{ y: yGlows }}
        className={`absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-35 ${glowTeal}`}
      />
      <motion.div
        style={{ y: yGlows }}
        className={`absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-35 ${glowSky}`}
      />
      <motion.div
        style={{ y: yGlows }}
        className={`absolute bottom-[-10rem] left-1/4 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-35 ${glowAmber}`}
      />
      <motion.svg
        style={{ y: yGrid }}
        className="absolute inset-0 w-full h-full opacity-10 md:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={isDark ? "#334155" : "#c7d2fe"} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </motion.svg>
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.03] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
    </div>
  );
}

/** Awwwards extras */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 h-[2px] bg-teal-400 z-[60] w-full"
    />
  );
}
function Magnetic({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.2 });
  const y = useSpring(my, { stiffness: 200, damping: 20, mass: 0.2 });
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    mx.set(dx * 12);
    my.set(dy * 12);
  }
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
function TiltCard({
  children,
  className = "",
  enabled = true,
}: {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 15, mass: 0.3 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 15, mass: 0.3 });
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width,
      py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 14);
    rx.set(-(py - 0.5) * 14);
  }
  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Ticker */
function TickerRail({
  isDark,
  duration = 22,
  enabled = true,
}: {
  isDark: boolean;
  duration?: number;
  enabled?: boolean;
}) {
  const items = [
    { label: "+$5,000", unit: "USDT", color: "#26A17B" },
    { label: "+$25,000", unit: "ETH", color: "#627EEA" },
    { label: "+$5,000", unit: "USDC", color: "#2775CA" },
    { label: "+$12,000", unit: "BTC", color: "#F7931A" },
    { label: "+$7,500", unit: "SOL", color: "#14F195" },
    { label: "+$9,500", unit: "TRX", color: "#FF0000" },
    { label: "+$16,500", unit: "BNB", color: "#F0B90B" },
    { label: "+$19,999", unit: "BUSD", color: "#F3BA2F" },
  ];
  const railChrome = isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200";
  return (
    <div className={`relative border-y ${railChrome}`}>
      <div className="overflow-hidden">
        {enabled ? (
          <motion.div
            className="flex items-center gap-3 py-2 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-3">
                {items.map((it, idx) => (
                  <div
                    key={`${dup}-${idx}`}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold shadow"
                    style={{
                      background: "linear-gradient(90deg, rgba(0,0,0,.65), rgba(0,0,0,.45))",
                      border: `1px solid ${it.color}66`,
                      boxShadow: `0 8px 30px rgba(0,0,0,.25), 0 0 24px ${it.color}44`,
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: it.color }} />
                    <span className="tracking-wide">{it.label}</span>
                    <span className="opacity-80">{it.unit}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center gap-3 py-2 whitespace-nowrap">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold shadow"
                style={{
                  background: "linear-gradient(90deg, rgba(0,0,0,.65), rgba(0,0,0,.45))",
                  border: `1px solid ${it.color}66`,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: it.color }} />
                <span className="tracking-wide">{it.label}</span>
                <span className="opacity-80">{it.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function ScrollCue({ t }: { t: (k: string) => string }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-6 text-xs text-white/70 select-none">
      <motion.div
        initial={{ y: 0, opacity: 0.7 }}
        animate={{ y: [0, 4, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="flex items-center gap-2"
      >
        <ChevronDownCircle className="h-4 w-4" /> {t("hero_scroll")}
      </motion.div>
    </div>
  );
}

export default function App() {
  const prm = useReducedMotion();

  /* theme */
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wbb-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("wbb-theme", theme);
    } catch {}
  }, [theme]);
  const isDark = theme === "dark";

  /* i18n */
  const [lang, setLang] = useState<Lang>(() => getInitialLang());
  const t = createI18n(lang);
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [lang]);

  /* misc */
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      const msg = e.message || "";
      if (msg.includes("ResizeObserver loop")) e.stopImmediatePropagation();
    };
    window.addEventListener("error", handler, { capture: true });
    return () => window.removeEventListener("error", handler as any, { capture: true } as any);
  }, []);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile((e as MediaQueryList).matches ?? (e as MediaQueryListEvent).matches);
    setIsMobile(mq.matches);
    // @ts-ignore
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      // @ts-ignore
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);
  const enableFancy = !prm && !isMobile;

  const [walletMenuOpen, setWalletMenuOpen] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>("ethereum");
  const [address, setAddress] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const canSubmit = computeCanSubmit(address, contact, agree);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!computeCanSubmit(address, contact, agree)) return;
    setSubmitted(true);
  };

  const rootClass = isDark
    ? "relative min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-black text-gray-100"
    : "relative min-h-screen bg-white text-gray-900";
  const headerClass = isDark
    ? "sticky top-0 z-40 backdrop-blur-xl bg-[#0b0f1a]/80 border-b border-gray-800"
    : "sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200";
  const brandAccent = isDark ? "text-teal-300" : "text-teal-600";
  const buttonPrimary = isDark
    ? "rounded-2xl bg-teal-500 hover:bg-teal-400 text-white"
    : "rounded-2xl bg-teal-600 hover:bg-teal-500 text-white";
  const cardChrome = isDark ? "bg-[#0d1222]/80 border border-white/10" : "bg-white border border-gray-200";
  const chipBg = isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-800";
  const inputChrome = isDark
    ? "bg-[#0b1020] border-white/10 rounded-xl placeholder:text-gray-400 text-white"
    : "bg-white border-gray-300 rounded-xl placeholder:text-gray-400 text-gray-900";
  const labelColor = isDark ? "text-gray-200" : "text-gray-800";
  const fineText = isDark ? "text-gray-400" : "text-gray-600";

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (walletMenuOpen && !menuRef.current.contains(e.target as Node)) setWalletMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [walletMenuOpen]);

  return (
    <div className={rootClass}>
      <CryptoBackground theme={theme} />
      <ScrollProgress />

      <div className="relative z-10">
        {/* Header */}
        <header className={headerClass}>
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-teal-600 grid place-items-center ring-1 ring-teal-400/50">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold tracking-wide">
                Wallet<span className={brandAccent}>BuyBack</span>
              </span>
            </div>

            <div className="flex items-center gap-3 relative" ref={menuRef}>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <button
                  onClick={() => setWalletMenuOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${chipBg} hover:opacity-90`}
                >
                  {t("nav_wallets")} <ChevronDown className="h-4 w-4" />
                </button>
                <a href="#how" className="hover:opacity-80 transition">
                  {t("nav_how")}
                </a>
                <a href="#features" className="hover:opacity-80 transition">
                  {t("nav_features")}
                </a>
                <a href="#form" className="hover:opacity-80 transition">
                  {t("nav_form")}
                </a>
              </nav>

              {walletMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute top-12 right-24 hidden md:grid grid-cols-3 gap-3 p-3 rounded-2xl shadow-2xl ${
                    isDark ? "bg-[#0b1020]/95 border border-white/10" : "bg-white border border-gray-200"
                  }`}
                >
                  {[
                    {
                      name: "MetaMask",
                      color: BRAND_COLORS.metamask,
                      src: BRAND_SVGS.metamask,
                      text: "Ethereum / EVM",
                    },
                    {
                      name: "Phantom",
                      color: BRAND_COLORS.phantom,
                      src: BRAND_SVGS.phantom,
                      text: "Solana",
                    },
                    {
                      name: "Trust Wallet",
                      color: BRAND_COLORS.trust,
                      src: BRAND_SVGS.trust,
                      text: "Multi-chain",
                    },
                  ].map((w) => (
                    <div
                      key={w.name}
                      className={`rounded-xl p-3 flex items-center gap-2 ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className="h-8 w-8 grid place-items-center rounded-lg"
                        style={{ backgroundColor: w.color + "22" }}
                      >
                        <img src={w.src} alt={w.name} className="h-5 w-5 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: w.color }}>
                          {w.name}
                        </div>
                        <div className={`text-xs ${fineText}`}>{w.text}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* language select */}
              <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
                <SelectTrigger className="w-[160px] min-w-[160px]">
                  <SelectValue placeholder="ru" />
                </SelectTrigger>
                <SelectContent
                  className={`${
                    isDark
                      ? "bg-[#0b1020] border-white/10 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                  align="end"
                >
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">简体中文</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                </SelectContent>
              </Select>

              <Magnetic enabled={enableFancy}>
                <Button className={buttonPrimary} asChild>
                  <a href="#form">{t("hero_cta")}</a>
                </Button>
              </Magnetic>
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`h-10 w-10 grid place-items-center rounded-2xl border ${
                  isDark ? "border-white/15 bg-white/5" : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <TickerRail isDark={isDark} duration={isMobile ? 28 : 22} enabled={!prm} />

        {/* HERO */}
        <section className="relative isolate">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1 ${
                  isDark ? "bg-white/10 ring-white/15" : "bg-teal-50 ring-teal-200"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${isDark ? "" : "text-teal-600"}`} />
                <span
                  className={`text-xs tracking-wide ${
                    isDark ? "text-white/80" : "text-teal-700"
                  }`}
                >
                  {t("hero_badge_fast_estimate")} · +$5000
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
                <Reveal>{t("hero_title_1")}</Reveal>{" "}
                <Reveal delay={0.05}>
                  <motion.span
                    whileHover={{ textShadow: `0 0 8px ${BRAND_COLORS.metamask}` }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ color: BRAND_COLORS.metamask }}
                  >
                    MetaMask
                  </motion.span>
                </Reveal>
                ,{" "}
                <Reveal delay={0.1}>
                  <motion.span
                    whileHover={{ textShadow: `0 0 8px ${BRAND_COLORS.phantom}` }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ color: BRAND_COLORS.phantom }}
                  >
                    Phantom
                  </motion.span>
                </Reveal>
                ,{" "}
                <Reveal delay={0.15}>
                  {t("hero_title_and")}{" "}
                  <motion.span
                    whileHover={{ textShadow: `0 0 8px ${BRAND_COLORS.trust}` }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ color: BRAND_COLORS.trust }}
                  >
                    Trust Wallet
                  </motion.span>
                </Reveal>
              </h1>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      name: "MetaMask",
                      color: BRAND_COLORS.metamask,
                      src: BRAND_SVGS.metamask,
                    },
                    { name: "Phantom", color: BRAND_COLORS.phantom, src: BRAND_SVGS.phantom },
                    {
                      name: "Trust Wallet",
                      color: BRAND_COLORS.trust,
                      src: BRAND_SVGS.trust,
                    },
                  ].map((w, i) => (
                    <motion.div
                      key={w.name}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium shadow"
                      style={{ backgroundColor: w.color, boxShadow: `0 0 22px ${w.color}66` }}
                      animate={enableFancy ? { y: [0, -3, 0] } : undefined}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                      whileHover={enableFancy ? { scale: 1.05, rotate: 0.4 } : undefined}
                    >
                      <img src={w.src} alt={w.name} className="h-4 w-4 object-contain drop-shadow" />
                      {w.name}
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className={`px-3 py-1.5 rounded-full ${chipBg}`}>
                    {t("hero_badge_fast_estimate")}
                  </div>
                  <div className={`px-3 py-1.5 rounded-full ${chipBg}`}>{t("hero_badge_safe")}</div>
                  <div className={`px-3 py-1.5 rounded-full ${chipBg}`}>
                    {t("hero_badge_fast_payout")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Magnetic enabled={enableFancy}>
                  <Button className={buttonPrimary} asChild>
                    <a href="#form">{t("hero_cta")}</a>
                  </Button>
                </Magnetic>
                <div className={`text-xs flex items-center gap-2 ${fineText}`}>
                  <Lock className="h-4 w-4" /> {t("seed_safety_hint")}
                </div>
              </div>

              <ScrollCue t={t} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TiltCard enabled={enableFancy} className="will-change-transform">
                <Card className={`${cardChrome} rounded-3xl overflow-hidden shadow-sm`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 grid place-items-center rounded-xl ${
                            isDark
                              ? "bg-teal-500 ring-1 ring-teal-300/50"
                              : "bg-teal-600 ring-1 ring-teal-400/50"
                          }`}
                        >
                          <Coins className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm ${fineText}`}>{t("form_fast_estimate")}</p>
                          <p className="text-lg font-medium">{t("form_pre_title")}</p>
                        </div>
                      </div>
                      <div className={`text-xs ${fineText}`}>~ 2 {t("minutes_short")}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className={labelColor}>{t("form_network")}</Label>
                      <Select value={network} onValueChange={setNetwork}>
                        <SelectTrigger className={inputChrome}>
                          <SelectValue placeholder={t("form_network_placeholder")} />
                        </SelectTrigger>
                        <SelectContent
                          className={`${
                            isDark
                              ? "bg-[#0b1020] border-white/10 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <SelectItem value="ethereum">Ethereum / MetaMask</SelectItem>
                          <SelectItem value="solana">Solana / Phantom</SelectItem>
                          <SelectItem value="bsc">BNB Chain</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="ton">TON</SelectItem>
                          <SelectItem value="other">{t("form_network_other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className={labelColor}>{t("form_address_label")}</Label>
                      <Input
                        placeholder={t("form_address_placeholder")}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputChrome}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className={labelColor}>{t("form_contact_label")}</Label>
                      <Input
                        placeholder={t("form_contact_placeholder")}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={inputChrome}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className={labelColor}>{t("form_desc_label")}</Label>
                      <Textarea
                        placeholder={t("form_desc_placeholder")}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className={`${inputChrome} min-h-[96px]`}
                      />
                    </div>
                    <label
                      className={`flex items-start gap-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className={`mt-1 ${isDark ? "accent-teal-400" : "accent-teal-600"}`}
                      />
                      <span>{t("form_owner_confirm")}</span>
                    </label>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className={`text-xs flex items-center gap-2 ${fineText}`}>
                      <ShieldCheck className="h-4 w-4" /> {t("form_payouts_hint")}
                    </div>
                    <Magnetic enabled={enableFancy}>
                      <Button onClick={handleSubmit} disabled={!canSubmit} className={buttonPrimary}>
                        <Send className="mr-2 h-4 w-4" /> {t("form_submit")}
                      </Button>
                    </Magnetic>
                  </CardFooter>
                </Card>
              </TiltCard>
              {submitted && (
                <div className={`mt-4 text-sm ${isDark ? "text-teal-300" : "text-teal-700"}`}>
                  {t("form_thanks")}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-4 pb-8 md:pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <ShieldCheck className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                ),
                title: t("feat_transparency_title"),
                text: t("feat_transparency_text"),
              },
              {
                icon: (
                  <Wallet className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                ),
                title: t("feat_networks_title"),
                text: t("feat_networks_text"),
              },
              {
                icon: (
                  <Coins className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                ),
                title: t("feat_fast_payout_title"),
                text: t("feat_fast_payout_text"),
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <Card className={`${cardChrome} rounded-3xl shadow-sm`}>
                  <CardContent className="p-6">
                    <div
                      className={`h-10 w-10 rounded-xl grid place-items-center mb-4 ${
                        isDark ? "bg-white/10" : "bg-teal-50"
                      }`}
                    >
                      {f.icon}
                    </div>
                    <h3 className="text-lg mb-2">{f.title}</h3>
                    <p className={`text-sm leading-relaxed ${fineText}`}>{f.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto max-w-7xl px-4 py-20">
          <div className="relative hidden md:block mb-12">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: t("step_01"),
                text: t("step_01_text"),
                icon: (
                  <Wallet className={`${isDark ? "text-teal-300" : "text-teal-600"} h-5 w-5`} />
                ),
              },
              {
                num: "02",
                title: t("step_02"),
                text: t("step_02_text"),
                icon: (
                  <Sparkles className={`${isDark ? "text-teal-300" : "text-teal-600"} h-5 w-5`} />
                ),
              },
              {
                num: "03",
                title: t("step_03"),
                text: t("step_03_text"),
                icon: (
                  <ShieldCheck className={`${isDark ? "text-teal-300" : "text-teal-600"} h-5 w-5`} />
                ),
              },
              {
                num: "04",
                title: t("step_04"),
                text: t("step_04_text"),
                icon: (
                  <Coins className={`${isDark ? "text-teal-300" : "text-teal-600"} h-5 w-5`} />
                ),
              },
            ].map((s, i, arr) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-visible rounded-3xl p-6 shadow-sm ${cardChrome}`}
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
                  <div
                    className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(36rem 24rem at 80% 0%, rgba(45,212,191,.10), transparent 60%)",
                      filter: "blur(2px)",
                    }}
                  />
                </div>

                <div className="pointer-events-none absolute top-2 right-3 z-0 text-[64px] md:text-[88px] lg:text-[104px] font-black leading-[0.9] tracking-tighter text-white/10 select-none">
                  {s.num}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-10 w-10 rounded-xl grid place-items-center ${
                        isDark ? "bg-white/10" : "bg-teal-50"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-xs uppercase tracking-wider ${fineText}`}>
                      {t("step_label")} {s.num}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
                  <p className={`text-sm leading-relaxed ${fineText}`}>{s.text}</p>
                </div>

                <motion.span
                  className="absolute left-6 right-6 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  style={{ transformOrigin: "0% 50%" }}
                />

                {i < arr.length - 1 && (
                  <span className="hidden md:block absolute top-16 -right-3 w-6 h-px bg-white/10" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* FORM (section) */}
        <section id="form" className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {t("form_title_left")}
              </h2>
              <p className={`max-w-xl mb-6 ${fineText}`}>{t("form_subtitle_left")}</p>
              <ul className={`space-y-3 text-sm ${fineText}`}>
                <li className="flex gap-2">
                  <Lock className="h-4 w-4 mt-0.5" /> {t("seed_safety_hint")}
                </li>
                <li className="flex gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5" /> {t("form_contacts_hint")}
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5" /> {t("form_buyback_hint")}
                </li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className={`${cardChrome} rounded-3xl p-6 grid gap-4 shadow-sm`}>
              <div className="grid gap-2">
                <Label className={labelColor}>{t("form_network")}</Label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger className={inputChrome}>
                    <SelectValue placeholder={t("form_network_placeholder")} />
                  </SelectTrigger>
                  <SelectContent
                    className={`${
                      isDark
                        ? "bg-[#0b1020] border-white/10 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <SelectItem value="ethereum">Ethereum / MetaMask</SelectItem>
                    <SelectItem value="solana">Solana / Phantom</SelectItem>
                    <SelectItem value="bsc">BNB Chain</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="ton">TON</SelectItem>
                    <SelectItem value="other">{t("form_network_other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className={labelColor}>{t("form_address_label")}</Label>
                <Input
                  placeholder={t("form_address_placeholder")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputChrome}
                />
              </div>
              <div className="grid gap-2">
                <Label className={labelColor}>{t("form_contact_label")}</Label>
                <Input
                  placeholder={t("form_contact_placeholder")}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={inputChrome}
                />
              </div>
              <div className="grid gap-2">
                <Label className={labelColor}>{t("form_desc_label")}</Label>
                <Textarea
                  placeholder={t("form_desc_placeholder")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${inputChrome} min-h-[96px]`}
                />
              </div>
              <label
                className={`flex items-start gap-3 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className={`${isDark ? "accent-teal-400" : "accent-teal-600"} mt-1`}
                />
                <span>{t("form_owner_confirm")}</span>
              </label>
              <Magnetic enabled={enableFancy}>
                <Button
                  type="submit"
                  disabled={!computeCanSubmit(address, contact, agree)}
                  className={buttonPrimary}
                >
                  <Send className="mr-2 h-4 w-4" /> {t("form_submit_short")}
                </Button>
              </Magnetic>
              {submitted && (
                <div className={`${isDark ? "text-teal-300" : "text-teal-700"} text-sm`}>
                  {t("form_thanks")}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={`mt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-2 gap-6 items-center">
            <p className={`text-xs ${fineText}`}>
              © {new Date().getFullYear()} WalletBuyBack — {t("footer_tagline")}
            </p>
            <div className="flex justify-start md:justify-end gap-4 text-sm">
              <a href="#how" className="hover:opacity-80">
                {t("nav_how")}
              </a>
              <a href="#features" className="hover:opacity-80">
                {t("nav_features")}
              </a>
              <a href="#form" className="hover:opacity-80">
                {t("nav_form")}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
