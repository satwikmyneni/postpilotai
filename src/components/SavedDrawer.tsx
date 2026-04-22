import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SavedPost {
  id: string;
  text: string;
  created_at: string;
}

export function SavedDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("saved_posts")
      .select("id, text, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Failed to load saved posts");
        } else {
          setPosts(data ?? []);
        }
        setLoading(false);
      });
  }, [open]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("saved_posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    }
  };

  const copyText = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  library
                </span>
                <h3 className="mt-0.5 text-base font-semibold">
                  Saved posts{" "}
                  <span className="text-muted-foreground">({posts.length})</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md border border-border-strong bg-surface-2 p-1.5 hover:bg-accent"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {loading && (
                <div className="grid place-items-center py-20">
                  <span className="font-mono text-[11px] text-muted-foreground animate-pulse">
                    loading…
                  </span>
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="grid place-items-center py-20 text-center">
                  <span className="font-mono text-[11px] text-muted-foreground">empty</span>
                  <p className="mt-1 max-w-[220px] text-sm text-muted-foreground">
                    No saved posts yet. Generate one and hit Save.
                  </p>
                </div>
              )}

              {posts.map((p) => (
                <div key={p.id} className="surface-2 p-4">
                  <p className="line-clamp-6 whitespace-pre-wrap text-[13.5px] leading-relaxed">
                    {p.text}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => copyText(p.text)}
                        className="rounded-md border border-border-strong bg-background px-2 py-1 text-[11px] hover:bg-surface"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-md border border-border-strong bg-background px-2 py-1 text-[11px] text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
