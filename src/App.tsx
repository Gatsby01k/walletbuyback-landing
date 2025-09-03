import { useState, useId } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ShieldCheck,
  MessageSquare,
  Send,
  Sparkles,
  Lock,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

type NetworkKey = "eth" | "sol" | "ton" | "other";

const networks: { key: NetworkKey; name: string }[] = [
  { key: "eth", name: "Ethereum" },
  { key: "sol", name: "Solana" },
  { key: "ton", name: "TON" },
  { key: "other", name: "Other network" },
];

const steps = [
  {
    num: "01",
    title: "Address",
    text: "Enter your network and public address.",
    icon: <Lock className="text-teal-500 h-5 w-5" />,
  },
  {
    num: "02",
    title: "Evaluation",
    text: "We analyze transactions and collection rarity.",
    icon: <Sparkles className="text-teal-500 h-5 w-5" />,
  },
  {
    num: "03",
    title: "Offer",
    text: "We’ll make a buyback offer after evaluating your wallet.",
    icon: <ShieldCheck className="text-teal-500 h-5 w-5" />,
  },
  {
    num: "04",
    title: "Payout",
    text: "We agree on the method and send the funds.",
    icon: <Send className="text-teal-500 h-5 w-5" />,
  },
];

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

export default function App() {
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [net, setNet] = useState<NetworkKey>("eth");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const canSubmit = computeCanSubmit(address, contact, agree);
  const uid = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black text-gray-900 dark:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-black/40 border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-500" />
            <span className="font-extrabold tracking-tight text-lg">
              WalletBuyBack
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
            <a href="#wallets" className="hover:text-indigo-600">
              Wallets
            </a>
            <a href="#process" className="hover:text-indigo-600">
              Process
            </a>
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#form" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              Evaluate address <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="p-2 rounded-xl ring-1 ring-black/5 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </header>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(99,102,241,0.35),rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(40%_30%_at_50%_0%,rgba(99,102,241,0.25),rgba(0,0,0,0)_70%)]" />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24 md:pb-16 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            We’ll Buy Back Your Wallet
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl">
            Leave your address — and we’ll return value to your wallet.
          </p>
          <p className="mt-3 text-indigo-600 dark:text-indigo-400 font-semibold">
            Evaluation is free.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-3 font-semibold shadow-lg shadow-indigo-600/20"
            >
              Submit your address
              <ArrowUpRight className="w-5 h-5" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Learn how it works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-12 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <ChevronDown className="w-5 h-5 animate-bounce" />
            <span>Scroll down</span>
          </div>
        </div>

        {/* BRAND STRIP */}
        <div className="border-t border-black/5 dark:border-white/10">
          <div
            id="wallets"
            className="mx-auto max-w-6xl px-4 py-6 md:py-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="relative rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 flex items-center gap-3">
              <img src="/metamask.svg" alt="MetaMask" className="w-8 h-8" />
              <p className="text-sm">
                Support for{" "}
                <span className="text-orange-500">MetaMask</span>,{" "}
                <span className="text-indigo-500">Phantom</span>, and{" "}
                <span className="text-blue-600">Trust Wallet</span>
              </p>
            </div>
            <div className="relative rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5">
              <p className="text-sm">
                Payouts: USDT, USDC, BTC, ETH or local currency
              </p>
            </div>
            <div className="relative rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5">
              <p className="text-sm">
                We evaluate only public on-chain history. No private data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          How it works
        </h2>
        <div className="mt-10 grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative overflow-hidden rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white/50 dark:bg-white/5"
            >
              <div className="pointer-events-none absolute -inset-20 opacity-30 blur-2xl [mask-image:radial-gradient(closest-side,white,transparent)] bg-gradient-to-br from-indigo-400/40 via-purple-400/40 to-cyan-400/40" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Step {s.num}
                  </span>
                  {s.icon}
                </div>
                <h3 className="mt-2 font-bold text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Features
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="relative rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br from-white/80 to-white/30 dark:from-white/10 dark:to-white/5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold">Fast valuation</h3>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              We evaluate within 24–48 hours and contact you via your provided details.
            </p>
          </div>

          <div className="relative rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br from-white/80 to-white/30 dark:from-white/10 dark:to-white/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold">Transparency</h3>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              We evaluate only public on-chain history. No private data.
            </p>
          </div>

          <div className="relative rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br from-white/80 to-white/30 dark:from-white/10 dark:to-white/5">
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold">Fast payouts</h3>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              USDT, USDC, BTC, ETH or local currency.
            </p>
          </div>
        </div>
      </section>
      {/* FORM */}
      <section
        id="form"
        className="relative border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Submit your address for evaluation
          </h2>
          <div className="mt-8 grid md:grid-cols-2 gap-10">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor={`${uid}-network`}
                    className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Network
                  </label>
                  <div className="relative">
                    <select
                      id={`${uid}-network`}
                      value={net}
                      onChange={(e) => setNet(e.target.value as NetworkKey)}
                      className="appearance-none w-full cursor-pointer p-3 rounded-xl bg-white/60 dark:bg-black/30 text-gray-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-indigo-500/60"
                    >
                      {networks.map((n) => (
                        <option key={n.key} value={n.key}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`${uid}-address`}
                    className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    id={`${uid}-address`}
                    type="text"
                    placeholder="0x… or a Solana/TON address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 dark:bg-black/30 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/60 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${uid}-contact`}
                    className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Contact (email / Telegram / phone)
                  </label>
                  <input
                    id={`${uid}-contact`}
                    type="text"
                    placeholder="your@email / @telegram / phone"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 dark:bg-black/30 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/60 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${uid}-comment`}
                    className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Comment (optional)
                  </label>
                  <textarea
                    id={`${uid}-comment`}
                    placeholder="Explain why a specific type of wallet might be valuable"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 dark:bg-black/30 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/60 transition min-h-[96px]"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1"
                  />
                  <span>I confirm that I am the owner of the address.</span>
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
                      canSubmit
                        ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-black/10 dark:bg-white/10 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit request
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-gray-500">
                    Share your seed phrase or private keys only with trusted parties
                  </span>
                </div>
              </form>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 opacity-30 blur-2xl [mask-image:radial-gradient(closest-side,white,transparent)] bg-gradient-to-br from-indigo-400/40 via-purple-400/40 to-cyan-400/40 pointer-events-none" />
              <div className="relative rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5">
                <h3 className="font-bold">What we buy back</h3>
                <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Buyback — collections/NFT/Wallets only.</li>
                  <li>
                    We evaluate only public on-chain history. No private data.
                  </li>
                  <li>Fast payouts: USDT / USDC / BTC / ETH.</li>
                </ul>

                <div className="mt-6 p-4 rounded-2xl bg-yellow-500/10 ring-1 ring-yellow-500/20 text-yellow-700 dark:text-yellow-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Share your seed phrase or private keys only with trusted parties.
                  </p>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>Large number — does not clip and doesn’t overlap neighbors */</p>
                </div>
              </div>
            </div>
          </div>

          {submitted && (
            <div className="mt-8 rounded-2xl p-4 ring-1 ring-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Request sent. We will contact you using the provided details.
            </div>
          )}
        </div>
      </section>
      {/* FOOTER */}
      <footer className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-indigo-500" />
              <span className="font-extrabold tracking-tight text-lg">
                WalletBuyBack
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              a wallet evaluation service with subsequent buyback.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Navigation</h4>
            <ul className="mt-3 text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <a href="#wallets" className="hover:text-indigo-600">
                  Wallets
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-indigo-600">
                  Process
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#form" className="hover:text-indigo-600">
                  Evaluate address
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/10 py-6">
          <div className="mx-auto max-w-6xl px-4 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
            <span>© 2025 WalletBuyBack</span>
            <span>min</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
