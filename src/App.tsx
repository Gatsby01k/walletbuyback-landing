// src/App.tsx
import React, { useEffect, useState, FormEvent } from "react";
import { createI18n, type Lang } from "./i18n";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// lucide-react icons
import {
  ChevronDownCircle,
  ShieldCheck,
  Wallet,
  Coins,
  Send,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";

// --- helpers: autodetect & persist lang ---
function mapToLang(code: string): Lang {
  const c = code?.toLowerCase?.() || "";
  if (c.startsWith("ru")) return "ru";
  if (c.startsWith("zh")) return "zh"; // zh, zh-cn, zh-hans, ...
  if (c.startsWith("hi")) return "hi";
  if (c.startsWith("id") || c.startsWith("in")) return "id"; // id-ID / legacy 'in'
  if (c.startsWith("en")) return "en";
  return "en"; // fallback
}

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored) return stored as Lang;
  } catch {}
  const prefs = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language]
  ).filter(Boolean) as string[];
  for (const code of prefs) {
    const mapped = mapToLang(code);
    if (mapped) return mapped;
  }
  return "en";
}

function App() {
  // язык с автодетектом + localStorage
  const [lang, setLang] = useState<Lang>(() => getInitialLang());
  const t = createI18n(lang);

  // persist + <html lang="...">
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", "ltr"); // все выбранные языки LTR
    }
  }, [lang]);

  // форма
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [walletType, setWalletType] = useState("");
  const [desc, setDesc] = useState("");
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: t("feat_transparency_title"),
      text: t("feat_transparency_text"),
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      title: t("feat_networks_title"),
      text: t("feat_networks_text"),
    },
    {
      icon: <Coins className="h-5 w-5" />,
      title: t("feat_fast_payout_title"),
      text: t("feat_fast_payout_text"),
    },
  ];

  const steps = [
    { num: "01", title: t("step_01"), text: t("step_01_text") },
    { num: "02", title: t("step_02"), text: t("step_02_text") },
    { num: "03", title: t("step_03"), text: t("step_03_text") },
    { num: "04", title: t("step_04"), text: t("step_04_text") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5" />
            <span>Wallet Buyback</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
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

          {/* Lang Select */}
          <div className="flex items-center gap-2">
            <Label className="sr-only">{t("lang_label")}</Label>
            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ru" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">简体中文</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full border">
                {t("hero_badge_fast_estimate")}
              </span>
              <span className="px-3 py-1.5 rounded-full border">
                {t("hero_badge_safe")}
              </span>
              <span className="px-3 py-1.5 rounded-full border">
                {t("hero_badge_fast_payout")}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("hero_title_1")}
            </h1>

            <div className="flex items-center gap-3">
              <Button asChild>
                <a href="#form" className="inline-flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  {t("hero_cta")}
                </a>
              </Button>

              <a
                href="#how"
                className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
              >
                <ChevronDownCircle className="h-4 w-4" />
                {t("hero_scroll")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  {f.icon}
                  <h3 className="font-semibold">{f.title}</h3>
                </div>
                <p className="text-sm opacity-80">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl border p-5">
                <span className="text-xs uppercase tracking-wider opacity-70">
                  {t("step_label")} {s.num}
                </span>
                <h4 className="mt-2 font-semibold">{s.title}</h4>
                <p className="text-sm opacity-80 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="mb-6">
            <p className="text-sm opacity-80">{t("form_fast_estimate")}</p>
            <h2 className="text-xl font-semibold">{t("form_pre_title")}</h2>
          </div>

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-5 rounded-2xl border p-6"
          >
            {/* Network */}
            <div className="grid gap-2">
              <Label>{t("form_network")}</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Ethereum / Solana / ..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="tron">Tron</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label>{t("form_address_label")}</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("form_address_placeholder")}
              />
            </div>

            {/* Contact */}
            <div className="grid gap-2">
              <Label>{t("form_contact_label")}</Label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t("form_contact_placeholder")}
              />
            </div>

            {/* Wallet type */}
            <div className="grid gap-2">
              <Label>{t("form_wallet_type_label")}</Label>
              <Input
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
                placeholder={t("form_wallet_type_placeholder")}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>{t("form_desc_label")}</Label>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={t("form_desc_placeholder")}
              />
            </div>

            {/* Owner confirm */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={ownerConfirmed}
                onChange={(e) => setOwnerConfirmed(e.target.checked)}
              />
              <span className="text-sm">{t("form_owner_confirm")}</span>
            </label>

            {/* Payout hint */}
            <div className="text-xs flex items-center gap-2 opacity-80">
              <Coins className="h-4 w-4" />
              {t("form_payouts_hint")}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!ownerConfirmed}>
                <Send className="mr-2 h-4 w-4" />
                {t("form_submit")}
              </Button>

              {submitted && (
                <span className="inline-flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("form_thanks")}
                </span>
              )}
            </div>
          </form>

          {/* Quick anchors */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm opacity-80">
            <LinkIcon className="h-4 w-4" />
            <a href="#features" className="hover:opacity-100">
              {t("nav_features")}
            </a>
            <span>·</span>
            <a href="#how" className="hover:opacity-100">
              {t("nav_how")}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm opacity-70">
          © {new Date().getFullYear()} Wallet Buyback
        </div>
      </footer>
    </div>
  );
}

export default App;
