import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    badge: null,
    tagline: "Get a feel for it.",
    features: ["3 posts to start", "All 3 tones", "Live LinkedIn preview", "Copy & save"],
    cta: "Start free",
    highlight: false,
    url: null,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "per month",
    badge: "Most popular",
    tagline: "For students serious about their brand.",
    features: [
      "Unlimited posts",
      "All tones + style controls",
      "Viral hook generator",
      "Closing question toggle",
      "Save to library",
      "Priority generation speed",
    ],
    cta: "Go Pro",
    highlight: true,
    url: "https://pioneerlabs.gumroad.com/l/postpilot-pro",
  },
  {
    name: "Starter Pack",
    price: "₹99",
    period: "one-time",
    badge: "No subscription",
    tagline: "Pay once. Use anytime.",
    features: [
      "10 post credits",
      "All tones + style controls",
      "Save to library",
      "Never expires",
    ],
    cta: "Get 10 posts",
    highlight: false,
    url: "https://pioneerlabs.gumroad.com/l/postpilot-starter",
  },
];

export function Pricing({
  compact = false,
  onAuthRequired,
}: {
  compact?: boolean;
  onAuthRequired?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handlePaidCta = (url: string) => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <section id="pricing" className={compact ? "" : "container-page py-20 sm:py-28"}>
      {!compact && (
        <div className="mb-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            04 — pricing
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Honest pricing. <span className="text-muted-foreground">Cancel anytime.</span>
          </h2>
          <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
            Start free. Upgrade when you're ready. No credit card needed to begin.
          </p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`relative flex flex-col rounded-xl border p-6 ${plan.highlight
                ? "border-signature/40 bg-surface-2 shadow-[0_18px_60px_-20px_rgba(139,92,246,0.45)]"
                : "border-border bg-surface"
              }`}
          >
            {plan.badge && (
              <span
                className={`absolute -top-2.5 left-6 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wider ${plan.highlight
                    ? "bg-signature text-white"
                    : "border border-border-strong bg-surface-2 text-muted-foreground"
                  }`}
              >
                {plan.badge}
              </span>
            )}
            <h3 className="text-[15px] font-semibold">{plan.name}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{plan.tagline}</p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[13.5px] text-foreground/85"
                >
                  <svg viewBox="0 0 10 10" className="mt-1 h-2.5 w-2.5 shrink-0 text-signature">
                    <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan.url ? (
              <button
                onClick={() => handlePaidCta(plan.url!)}
                className={`mt-6 w-full rounded-md py-2.5 text-center text-[13px] font-medium transition ${plan.highlight ? "btn-primary" : "btn-secondary"
                  }`}
              >
                {!user ? "Sign in to upgrade" : plan.cta}
              </button>
            ) : (
              <a
                href="#generate"
                className="btn-secondary mt-6 block rounded-md py-2.5 text-center text-[13px] font-medium"
              >
                {plan.cta}
              </a>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-[12px] text-muted-foreground">
        🔒 Secure checkout via Gumroad &nbsp;·&nbsp; Cancel Pro anytime &nbsp;·&nbsp; Credits never expire
      </p>
    </section>
  );
}
