import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  loading?: boolean;
  authorName?: string;
  authorRole?: string;
  tone?: string;
  generatedInMs?: number | null;
}

const DEFAULT_POST = `47 rejections.

Then one yes.

I almost gave up after the 30th. The "we've decided to move forward with other candidates" emails started feeling like a copy-paste. My parents stopped asking. My friends stopped asking. I stopped telling people I was even applying.

But here's what I learned in those 4 months of silence:

→ Rejection isn't feedback. Most companies never tell you why.
→ Your worth isn't measured in offer letters.
→ The interview that finally said yes wasn't the most prestigious one — it was the one that felt right.

Today I'm starting as a Software Engineering Intern at a startup I genuinely admire.

If you're in the middle of your 30th rejection right now: keep going. The yes is closer than you think.`;

export function LinkedInPreview({
  text,
  loading,
  authorName = "Your Name",
  authorRole = "Your Role · Open to opportunities",
  tone = "Story-driven",
  generatedInMs,
}: Props) {
  // Safe initials — handle single words, empty strings, placeholder
  const initials = authorName
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "YN";
  return (
    <div className="relative">
      {/* Floating tag chip */}
      <div className="absolute -top-3 left-6 z-10 flex items-center gap-2 rounded-full border border-border-strong bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted-foreground">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signature opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signature" />
        </span>
        {loading ? "Generating preview…" : "Live preview"}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="surface noise relative overflow-hidden p-5 shadow-[var(--shadow-elevate)] sm:p-6"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6366f1] text-base font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-semibold text-foreground">{authorName}</span>
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 shrink-0 text-signature"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 0L9.8 2.2 12.6 1.6 13.2 4.4 16 5.2 14.4 7.6 16 10 13.2 10.8 12.6 13.6 9.8 13 8 15.2 6.2 13 3.4 13.6 2.8 10.8 0 10 1.6 7.6 0 5.2 2.8 4.4 3.4 1.6 6.2 2.2z" />
              </svg>
            </div>
            <p className="line-clamp-1 text-[12.5px] text-muted-foreground">{authorRole}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-muted-foreground">
              now ·{" "}
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2.5A4.5 4.5 0 113.5 8 4.5 4.5 0 018 3.5z" />
              </svg>
            </p>
          </div>
          <button
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-2"
            aria-label="More"
          >
            <span className="text-muted-foreground">···</span>
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 min-h-[260px]">
          {loading ? (
            <TypingPlaceholder />
          ) : text ? (
            <TypewriterText text={text} />
          ) : (
            <p className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-foreground/95">
              {DEFAULT_POST}
            </p>
          )}
        </div>

        {/* Reactions */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <Reaction color="#0a66c2" symbol="👍" />
              <Reaction color="#df704d" symbol="❤" />
              <Reaction color="#6dae4f" symbol="💡" />
            </div>
            <span>1,284</span>
          </div>
          <span>96 comments · 41 reposts</span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1 border-t border-border pt-2 text-[12.5px] text-muted-foreground">
          {[
            { l: "Like", i: "👍" },
            { l: "Comment", i: "💬" },
            { l: "Repost", i: "🔁" },
            { l: "Send", i: "✈" },
          ].map((a) => (
            <button
              key={a.l}
              className="flex items-center justify-center gap-1.5 rounded-md py-2 hover:bg-surface-2"
            >
              <span>{a.i}</span>
              <span className="hidden font-medium sm:inline">{a.l}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Floating annotation badges */}
      <FloatingBadge className="-right-2 top-20 hidden md:flex" delay={0.6}>
        <span className="text-signature">●</span>
        {generatedInMs != null
          ? `generated in ${(generatedInMs / 1000).toFixed(1)}s`
          : loading
          ? "generating…"
          : "ready to generate"}
      </FloatingBadge>
      <FloatingBadge className="-left-3 bottom-24 hidden md:flex" delay={0.9}>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          tone
        </span>
        <span className="font-medium text-foreground">{tone}</span>
      </FloatingBadge>
    </div>
  );
}

function Reaction({ color, symbol }: { color: string; symbol: string }) {
  return (
    <span
      className="grid h-4 w-4 place-items-center rounded-full text-[8px] ring-2 ring-surface"
      style={{ background: color }}
    >
      {symbol}
    </span>
  );
}

function FloatingBadge({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`absolute z-20 items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[11px] text-muted-foreground shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Animated skeleton + label shown while Claude is generating */
function TypingPlaceholder() {
  return (
    <div className="space-y-3">
      {[100, 92, 78, 65, 88, 72, 50].map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3, width: "0%" }}
          animate={{ opacity: [0.4, 0.7, 0.4], width: `${w}%` }}
          transition={{
            duration: 1.6,
            delay: i * 0.12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="h-3 rounded-full bg-surface-2"
        />
      ))}
      <div className="pt-2 text-[12px] text-muted-foreground">
        <span className="font-mono text-signature">~</span> co-pilot is writing…
        <span className="animate-blink ml-1 inline-block h-3 w-[1.5px] bg-foreground align-middle" />
      </div>
    </div>
  );
}

/** Typewriter — streams text in chunks targeting ~1.5 s total, regardless of post length */
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(false);
      return;
    }

    // Reset and start fresh every time text changes
    setDisplayed("");
    setDone(false);
    let i = 0;

    const INTERVAL_MS = 16;           // ~60 fps
    const TARGET_MS = 1500;           // always ~1.5 s total
    const ticks = TARGET_MS / INTERVAL_MS;
    const charsPerTick = Math.max(1, Math.ceil(text.length / ticks));

    const id = setInterval(() => {
      i += charsPerTick;
      if (i >= text.length) {
        setDisplayed(text);           // guarantee the full text shows
        setDone(true);
        clearInterval(id);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, INTERVAL_MS);

    return () => clearInterval(id);   // cleanup on unmount or text change
  }, [text]);

  return (
    <p className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-foreground/95">
      {displayed}
      {!done && (
        <span className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] animate-[blink_0.9s_step-end_infinite] bg-signature align-middle" />
      )}
    </p>
  );
}
