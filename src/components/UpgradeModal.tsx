import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
  {
    id: "starter",
    label: "Starter Pack",
    badge: "ONE-TIME",
    price: "₹99",
    period: "one-time payment",
    posts: "10 posts",
    tagline: "Perfect for trying out PostPilot",
    features: [
      "10 post credits",
      "All 3 tones",
      "Viral hook + closing question",
      "Save to library",
      "Never expires",
    ],
    url: "https://pioneerlabs.gumroad.com/l/postpilot-starter",
    cta: "Get 10 Posts — ₹99",
    highlight: false,
    emoji: "⚡",
  },
  {
    id: "pro",
    label: "Pro",
    badge: "MOST POPULAR",
    price: "₹199",
    period: "per month",
    posts: "Unlimited posts",
    tagline: "For students serious about their brand",
    features: [
      "Unlimited post generation",
      "All 3 tones + styles",
      "Viral hook + closing question",
      "Save to library",
      "Priority generation speed",
      "Early access to new features",
    ],
    url: "https://pioneerlabs.gumroad.com/l/postpilot-pro",
    cta: "Start Pro — ₹199/month",
    highlight: true,
    emoji: "🚀",
  },
];

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="surface relative w-full max-w-2xl overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-md border border-border-strong bg-surface-2 p-1.5 hover:bg-accent"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>

            {/* Top banner */}
            <div className="border-b border-border bg-signature-soft px-6 py-5 text-center sm:px-9">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signature">
                free limit reached
              </span>
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                You're on a roll — don't stop now 🔥
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Pick a plan and keep writing posts that get noticed.
              </p>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2">
              {PLANS.map((plan, i) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col p-6 sm:p-7 ${i === 0 ? "border-b border-border sm:border-b-0 sm:border-r" : ""
                    } ${plan.highlight ? "bg-signature-soft/40" : ""}`}
                >
                  {/* Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${plan.highlight
                          ? "bg-signature text-white"
                          : "bg-surface-2 text-muted-foreground"
                        }`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-xl">{plan.emoji}</span>
                  </div>

                  {/* Plan name */}
                  <div className="text-[13px] font-medium text-muted-foreground">{plan.label}</div>

                  {/* Price */}
                  <div className="mt-1 flex items-end gap-1.5">
                    <span className="text-[2rem] font-bold leading-none tracking-tight">
                      {plan.price}
                    </span>
                    <span className="mb-0.5 text-[12.5px] text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>

                  {/* Posts highlight */}
                  <div
                    className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold ${plan.highlight
                        ? "bg-signature/15 text-signature"
                        : "bg-surface-2 text-foreground"
                      }`}
                  >
                    {plan.posts}
                  </div>

                  <p className="mt-2.5 text-[12.5px] text-muted-foreground">{plan.tagline}</p>

                  {/* Features */}
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[12.5px]">
                        <svg
                          viewBox="0 0 16 16"
                          className="mt-[1px] h-3.5 w-3.5 shrink-0 text-signature"
                          fill="none"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 4.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={plan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 block w-full rounded-md py-2.5 text-center text-[13.5px] font-semibold transition ${plan.highlight
                        ? "btn-primary shadow-lg shadow-signature/20"
                        : "border border-border-strong bg-background hover:bg-surface-2"
                      }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-surface-2 px-6 py-3 text-center">
              <p className="text-[11.5px] text-muted-foreground">
                🔒 Secure checkout via Gumroad &nbsp;·&nbsp; No hidden fees &nbsp;·&nbsp; Cancel Pro anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
