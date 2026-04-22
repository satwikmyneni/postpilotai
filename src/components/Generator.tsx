import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LinkedInPreview } from "./LinkedInPreview";
import { supabase } from "@/integrations/supabase/client";

type Tone = "Professional" | "Bold & Direct" | "Story-driven";

const TONES: { value: Tone; hint: string }[] = [
  { value: "Professional", hint: "Polished, confident" },
  { value: "Bold & Direct", hint: "Punchy, no fluff" },
  { value: "Story-driven", hint: "Personal, narrative" },
];

const SURPRISE_TOPICS = [
  "just cracked my first internship after 47 rejections",
  "lessons from my first college hackathon",
  "why I quit chasing perfect grades to start building",
  "what nobody tells you about your first 9-to-5",
  "DSA prep tips that actually worked for placements",
  "how cold-DMing 100 founders changed my career",
  "what I wish I knew before joining a startup as a fresher",
  "switching from CSE to product after 2 years",
];

const FREE_LIMIT = 3;


export function Generator({
  onUpgrade,
  onOpenSaved,
}: {
  onUpgrade: () => void;
  onOpenSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Story-driven");
  const [hook, setHook] = useState(true);
  const [question, setQuestion] = useState(false);
  const [emoji, setEmoji] = useState(false);

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [generatedInMs, setGeneratedInMs] = useState<number | null>(null);
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    setUsage(Number(localStorage.getItem("postpilot_count") || "0"));
  }, []);

  const handleSurprise = () => {
    setRole((r) => r || "CS Student");
    setTopic(SURPRISE_TOPICS[Math.floor(Math.random() * SURPRISE_TOPICS.length)]);
  };

  const handleGenerate = async () => {
    if (!role.trim() || !topic.trim()) {
      toast.error("Add your role and a topic to continue");
      return;
    }
    if (usage >= FREE_LIMIT) {
      onUpgrade();
      return;
    }
    setLoading(true);
    setOutput("");
    setGeneratedInMs(null);
    const startMs = Date.now();
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, topic, tone, hook, question, emoji }),
      });
      const res = await resp.json();
      if (res.error) {
        toast.error(res.error);
      } else {
        setOutput(res.post);
        setGeneratedInMs(Date.now() - startMs);
        const next = usage + 1;
        setUsage(next);
        localStorage.setItem("postpilot_count", String(next));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        const ta = document.createElement("textarea");
        ta.value = output;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed — please select and copy manually");
    }
  };

  const handleSave = async () => {
    if (!output) {
      toast.error("Generate a post first before saving");
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sign in to save posts to your library");
        return;
      }
      const { error } = await supabase
        .from("saved_posts")
        .insert({ text: output, user_id: session.user.id });
      if (error) throw error;
      toast.success("Saved to your library");
      onOpenSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save — please try again");
    }
  };

  // Derived preview values — update live as user types
  const previewName = name.trim() || "Your Name";
  const previewRole = role.trim() || "Your Role";

  return (
    <section id="generate" className="container-page py-20 sm:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <SectionLabel>02 — generator</SectionLabel>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Write your next post.
          </h2>
          <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
            Three inputs. One click. A post that doesn't sound like a press release.
          </p>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground sm:block">
          {Math.max(0, FREE_LIMIT - usage)}/{FREE_LIMIT} free posts
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <div className="surface noise relative p-6 sm:p-7">
          <div className="space-y-6">
            <Field label="Your Name" hint="Shows on the preview">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aanya Sharma"
                className="w-full rounded-md border border-border-strong bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-signature"
              />
            </Field>

            <Field label="Role" hint="Who you are">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="CS Student, Data Analyst, Fresher…"
                className="w-full rounded-md border border-border-strong bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-signature"
              />
            </Field>

            <Field
              label="Topic"
              hint={
                <button
                  onClick={handleSurprise}
                  className="font-medium text-signature hover:underline"
                >
                  Surprise me →
                </button>
              }
            >
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="just landed my first internship · lessons from rejection · DSA tips that worked…"
                rows={3}
                className="w-full resize-none rounded-md border border-border-strong bg-background px-3 py-2.5 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-signature"
              />
            </Field>

            <Field label="Tone" hint="Pick one">
              <div className="grid grid-cols-3 gap-1.5">
                {TONES.map((t) => {
                  const active = tone === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`rounded-md border px-3 py-2.5 text-left transition ${active
                        ? "border-signature/60 bg-signature-soft text-foreground"
                        : "border-border-strong bg-background text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <div className="text-[13px] font-medium text-foreground">{t.value}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{t.hint}</div>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Style" hint="Optional touches">
              <div className="flex flex-wrap gap-2">
                <Toggle checked={hook} onChange={setHook}>Viral hook</Toggle>
                <Toggle checked={question} onChange={setQuestion}>Closing question</Toggle>
                <Toggle checked={emoji} onChange={setEmoji}>Emoji</Toggle>
              </div>
            </Field>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-[14px] font-medium disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Spinner /> Co-pilot is writing…
                  </>
                ) : (
                  <>
                    Generate post
                    <span className="kbd ml-1 !bg-white/15 !text-white/90 !border-white/25">↵</span>
                  </>
                )}
              </button>
              {output && (
                <button
                  onClick={handleGenerate}
                  className="btn-secondary rounded-md px-3 py-3 text-[13px] font-medium"
                  aria-label="Regenerate"
                >
                  ↻
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="relative">
          <LinkedInPreview
            text={output}
            loading={loading}
            authorName={previewName}
            authorRole={`${previewRole} · Open to opportunities`}
            tone={tone}
            generatedInMs={generatedInMs}
          />

          <AnimatePresence>
            {output && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-[12px]"
              >
                <span className="font-mono text-muted-foreground">
                  {output.length} chars · {output.split(/\s+/).filter(Boolean).length} words
                </span>
                <div className="flex items-center gap-1.5">
                  <MiniBtn onClick={handleCopy}>Copy</MiniBtn>
                  <MiniBtn onClick={handleSave}>Save</MiniBtn>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] transition ${checked
        ? "border-signature/60 bg-signature-soft text-foreground"
        : "border-border-strong bg-background text-muted-foreground hover:text-foreground"
        }`}
    >
      <span
        className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${checked ? "border-signature bg-signature" : "border-border-strong"
          }`}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="h-2 w-2 text-white">
            <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

function MiniBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-border-strong bg-background px-2.5 py-1 text-[11.5px] font-medium hover:bg-surface-2"
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
