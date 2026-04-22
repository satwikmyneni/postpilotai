import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { LinkedInPreview } from "@/components/LinkedInPreview";
import { Generator } from "@/components/Generator";
import { Pricing } from "@/components/Pricing";
import { SavedDrawer } from "@/components/SavedDrawer";
import { UpgradeModal } from "@/components/UpgradeModal";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PostPilot — LinkedIn posts in 10 seconds" },
      {
        name: "description",
        content:
          "PostPilot turns three inputs into a scroll-stopping LinkedIn post. Built for students and young professionals.",
      },
      { property: "og:title", content: "PostPilot — LinkedIn posts in 10 seconds" },
      {
        property: "og:description",
        content: "From blank page to scroll-stopping post in 10 seconds.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative min-h-screen">
      <Toaster position="bottom-right" theme="dark" />

      <Nav
        onSaved={() => setDrawerOpen(true)}
        onCta={() => scrollTo("generate")}
        onAuth={() => setAuthOpen(true)}
        user={user}
        onSignOut={() => supabase.auth.signOut()}
      />

      <Hero onCta={() => scrollTo("generate")} onSecondary={() => scrollTo("how")} />

      <Marquee />

      <HowItWorks />

      <Generator
        onUpgrade={() => setUpgradeOpen(true)}
        onOpenSaved={() => setDrawerOpen(true)}
      />

      <Features />

      <Pricing onAuthRequired={() => setAuthOpen(true)} />

      <FinalCTA onCta={() => scrollTo("generate")} />

      <Footer />

      <SavedDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-b from-[#a78bfa] to-[#6366f1] text-[11px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
        ▲
      </span>
      <span className="text-[15px] tracking-tight">PostPilot</span>
    </div>
  );
}

function Nav({
  onSaved,
  onCta,
  onAuth,
  user,
  onSignOut,
}: {
  onSaved: () => void;
  onCta: () => void;
  onAuth: () => void;
  user: User | null;
  onSignOut: () => void;
}) {
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container-page flex h-14 items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#generate" className="hover:text-foreground">Generator</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#changelog" className="hover:text-foreground">Changelog</a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSaved}
            className="hidden rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Library
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-[12px] text-muted-foreground sm:block">
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={onSignOut}
                className="rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuth}
              className="rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
            >
              Sign in
            </button>
          )}
          <button
            onClick={onCta}
            className="btn-primary rounded-md px-3 py-1.5 text-[12.5px] font-medium"
          >
            Try free
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onCta, onSecondary }: { onCta: () => void; onSecondary: () => void }) {
  return (
    <header className="relative overflow-hidden">
      {/* faint dotted background */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[640px] grid-dots opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      {/* signature glow halo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[-200px] -z-10 h-[460px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.55), rgba(99,102,241,0.18) 50%, transparent 70%)",
        }}
      />

      <div className="container-page grid grid-cols-1 items-center gap-12 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:pt-28 lg:pb-28">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pill"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-signature-soft text-[9px] text-signature">
              ✦
            </span>
            From blank page to viral post in 10 seconds
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-balance mt-5 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[58px] lg:text-[64px]"
          >
            Your LinkedIn{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] bg-clip-text text-transparent">
                co-pilot
              </span>
              <svg
                aria-hidden
                viewBox="0 0 240 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-signature/70"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q60 1 120 7 T238 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-muted-foreground/70"> — </span>for the rest of us.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-pretty mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]"
          >
            Three inputs. One click. A LinkedIn post that actually sounds human.
            Built for students, freshers, and young professionals who'd rather build than write.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onCta}
              className="btn-primary inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium"
            >
              Generate a free post
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={onSecondary}
              className="btn-secondary rounded-md px-4 py-2.5 text-[14px] font-medium"
            >
              See how it works
            </button>
            <span className="ml-1 hidden items-center gap-1.5 text-[12px] text-muted-foreground sm:inline-flex">
              press <span className="kbd">G</span> to generate
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-4 border-t border-border pt-6 text-[12.5px] text-muted-foreground"
          >
            <Stat label="posts shipped" value="48,210" />
            <span className="text-border">·</span>
            <Stat label="avg. time" value="9.4s" />
            <span className="text-border">·</span>
            <Stat label="rating" value="4.9 / 5" />
          </motion.div>
        </div>

        {/* Live demo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <LinkedInPreview text="" />
        </motion.div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-[13px] text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */

function Marquee() {
  const items = [
    "IIT Bombay",
    "BITS Pilani",
    "Stanford",
    "NIT Trichy",
    "IIIT Hyderabad",
    "Y Combinator W24",
    "MIT",
    "Anna University",
    "VIT",
  ];
  return (
    <section className="border-y border-border bg-surface/40 py-6">
      <div className="container-page flex items-center gap-6">
        <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:inline">
          trusted by students at
        </span>
        <div className="relative w-full overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
          <div className="flex animate-marquee gap-10 whitespace-nowrap text-[13px] text-muted-foreground">
            {[...items, ...items].map((it, i) => (
              <span key={i} className="opacity-80">
                {it}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Tell us who you are",
    desc: "Your role, field, or vibe. CS student, fresher, marketing intern — whatever fits.",
  },
  {
    n: "02",
    title: "Pick a topic & tone",
    desc: "Drop a thought. Choose how you want it to sound. We handle the rest.",
  },
  {
    n: "03",
    title: "Copy & post",
    desc: "Polished post in seconds. Tweak, copy, and ship to LinkedIn.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="container-page py-20 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          01 — how it works
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Three steps. <span className="text-muted-foreground">No fluff.</span>
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="surface relative overflow-hidden p-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-[11px] tracking-wider text-signature">{s.n}</span>
              <span className="font-mono text-[10px] text-muted-foreground">step</span>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    title: "Built for students",
    desc: "Trained on the language of campus, internships, hackathons, and first jobs — not corporate jargon.",
  },
  {
    title: "10-second posts",
    desc: "Average generation time: 9.4 seconds. From idea to ship before your next coffee sip.",
  },
  {
    title: "Sounds like you",
    desc: "Tone presets and style controls keep your voice intact. No 'thrilled to announce' energy.",
  },
  {
    title: "Hooks that stop scrolls",
    desc: "Toggle a viral hook and we'll open with a line designed to make people stop and read.",
  },
];

function Features() {
  return (
    <section id="features" className="container-page py-20 sm:py-28">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            03 — why postpilot
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Posts that don't sound like a press release.
          </h2>
        </div>
        <p className="max-w-sm text-[14px] text-muted-foreground">
          Every detail engineered for one thing: helping you sound like the smartest version of
          yourself.
        </p>
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-surface p-7 sm:p-9"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-signature" />
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-[18px] font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FinalCTA({ onCta }: { onCta: () => void }) {
  return (
    <section className="container-page pb-24">
      <div className="surface relative overflow-hidden p-10 text-center sm:p-16">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(139,92,246,0.18), transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signature">
            ship today
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop staring at the blank box.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
            Your first post is 10 seconds away. The next 1,000 are easy after that.
          </p>
          <button
            onClick={onCta}
            className="btn-primary mt-7 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium"
          >
            Generate your first post
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-[13px] text-muted-foreground">
            From blank page to viral post in 10 seconds. Built for students who hustle.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            ["Generator", "#generate"],
            ["Pricing", "#pricing"],
            ["Changelog", "#changelog"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About", "#"],
            ["Contact", "mailto:hi@postpilot.ai"],
            ["Privacy", "#"],
          ]}
        />
        <FooterCol
          title="Follow"
          links={[
            ["LinkedIn", "#"],
            ["Twitter / X", "#"],
            ["Product Hunt", "#"],
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[12px] text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} PostPilot. Built with care for students who hustle.</span>
          <span className="font-mono">v1.0 · all systems go ●</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-[13.5px]">
        {links.map(([l, h]) => (
          <li key={l}>
            <a href={h} className="text-foreground/85 hover:text-foreground">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
