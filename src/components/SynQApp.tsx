import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

type Goal = "leads" | "authority" | "engagement" | "awareness" | "thought";
type Style = "story" | "contrarian" | "educational" | "personal";
type Tone = "professional" | "casual" | "bold" | "founder";

interface FormData {
  goal: Goal | null;
  style: Style | null;
  topic: string;
  tone: Tone | null;
  performingTopics: string[];
  context: string;
  pastPosts: string;
}

const GOALS: { id: Goal; label: string; emoji: string }[] = [
  { id: "leads", label: "Generate Leads", emoji: "🎯" },
  { id: "authority", label: "Build Authority", emoji: "👑" },
  { id: "engagement", label: "Increase Engagement", emoji: "💬" },
  { id: "awareness", label: "Product Awareness", emoji: "📢" },
  { id: "thought", label: "Thought Leadership", emoji: "💡" },
];

const STYLES: { id: Style; label: string; emoji: string }[] = [
  { id: "story", label: "Storytelling", emoji: "📖" },
  { id: "contrarian", label: "Contrarian", emoji: "⚡" },
  { id: "educational", label: "Educational", emoji: "🎓" },
  { id: "personal", label: "Personal Experience", emoji: "🙋" },
];

const TONES: { id: Tone; label: string; desc: string; emoji: string }[] = [
  { id: "professional", label: "Professional", desc: "Polished and credible", emoji: "💼" },
  { id: "casual", label: "Casual", desc: "Friendly and approachable", emoji: "😊" },
  { id: "bold", label: "Bold", desc: "Direct and provocative", emoji: "🔥" },
  { id: "founder", label: "Founder-style", desc: "Raw, real, opinionated", emoji: "🚀" },
];

function LogoMark() {
  return (
    <div className="relative h-9 w-9 rounded-xl bg-grad-primary flex items-center justify-center glow">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
      </svg>
    </div>
  );
}

function Header() {
  return (
    <header className="relative z-10 pt-8 pb-6 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <LogoMark />
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-gradient">SynQ Intelligence</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground -mt-0.5">
            AI-powered LinkedIn posts that sound like you
          </p>
        </div>
      </div>
    </header>
  );
}

function SectionLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-medium text-foreground">{children}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="relative h-40 w-40 mb-8">
        <div className="absolute inset-0 rounded-full bg-grad-primary opacity-20 blur-3xl orb" />
        <div className="absolute inset-6 rounded-3xl border border-white/10 glass-strong flex items-center justify-center rotate-6">
          <div className="h-14 w-14 rounded-2xl bg-grad-primary opacity-80 glow" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-grad-primary glow" />
        <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full border border-white/20 glass" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Your LinkedIn post will appear here</h3>
      <p className="text-sm text-muted-foreground mt-1.5">Fill in the details and hit Generate</p>
      <div className="flex gap-1.5 mt-6">
        <span className="dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "0s" }} />
        <span className="dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
        <span className="dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded shimmer" />
          <div className="h-2.5 w-24 rounded shimmer" />
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 rounded shimmer" />
        <div className="h-3 rounded shimmer w-[92%]" />
        <div className="h-3 rounded shimmer w-[80%]" />
        <div className="h-3 rounded shimmer w-[88%]" />
        <div className="h-3 rounded shimmer w-[70%]" />
        <div className="h-3 rounded shimmer w-[95%]" />
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Crafting your post
        <span className="dot inline-block ml-0.5" style={{ animationDelay: "0s" }}>.</span>
        <span className="dot inline-block" style={{ animationDelay: "0.2s" }}>.</span>
        <span className="dot inline-block" style={{ animationDelay: "0.4s" }}>.</span>
      </div>
    </div>
  );
}

function PostPreview({ post }: { post: string }) {
  const chars = post.length;
  const readSec = Math.max(15, Math.round(chars / 18));
  return (
    <div className="p-5 animate-fade-up">
      <div className="rounded-2xl glass-strong p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-grad-primary flex items-center justify-center text-white font-semibold">
            Y
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">You</div>
            <div className="text-xs text-muted-foreground">Founder & CEO</div>
            <div className="text-[11px] text-muted-foreground">just now · 🌐</div>
          </div>
        </div>
        <div className="mt-4 text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
          {post}
        </div>
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500/90 text-white text-[10px]">👍</span>
            <span className="inline-flex items-center justify-center h-5 w-5 -ml-1.5 rounded-full bg-rose-500/90 text-white text-[10px]">❤️</span>
            <span className="inline-flex items-center justify-center h-5 w-5 -ml-1.5 rounded-full bg-amber-500/90 text-white text-[10px]">💡</span>
            <span className="ml-2">1,284</span>
          </div>
          <div>{chars} characters · ~{readSec}s read</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTEXT ENGINE — extracts writing patterns from past posts
// ============================================================
function extractPatterns(rawPosts: string): string {
  if (!rawPosts.trim()) return "";

  const lines = rawPosts.split("\n").filter((l) => l.trim().length > 10);

  interface ParsedPost {
    text: string;
    impressions: number;
    engagement: number;
    score: number;
  }

  const parsed: ParsedPost[] = lines.map((line) => {
    const parts = line.split("|");
    const text = (parts[0] || line).trim();
    const imp = parseFloat((parts[1] || "").replace(/[^0-9.]/g, "") || "0");
    const eng = parseFloat((parts[2] || "").replace(/[^0-9.]/g, "") || "0");
    const score = imp * 0.4 + eng * 100 * 0.6;
    return { text, impressions: imp, engagement: eng, score };
  });

  const top3 = [...parsed].sort((a, b) => b.score - a.score).slice(0, 3);

  const patterns = top3.map((p) => {
    const lines2 = p.text.split("\n").filter(Boolean);
    const opener = lines2[0] || "";
    const hookType = opener.includes("?") ? "question hook"
      : /^[A-Z].*\.$/.test(opener) ? "bold statement"
      : opener.includes("I ") ? "personal story opener"
      : "direct claim";
    const avgLen = lines2.reduce((s, l) => s + l.length, 0) / (lines2.length || 1);
    const paraStyle = avgLen < 60 ? "short punchy paragraphs" : "medium paragraphs";
    const usesI = p.text.includes(" I ") || p.text.startsWith("I ");
    const endsCTA = /\?$/.test(p.text.trim()) || p.text.toLowerCase().includes("what do you");
    return `Hook: ${hookType}. Style: ${paraStyle}. First-person: ${usesI ? "yes" : "no"}. Ends with CTA/question: ${endsCTA ? "yes" : "no"}.`;
  });

  return patterns.join(" | ");
}

// ============================================================
// PROMPT BUILDER — assembles system + user prompt
// ============================================================
function buildPrompt(data: FormData, actionType: string): { system: string; user: string } {
  const goalLabels: Record<string, string> = {
    leads: "Generate Leads", authority: "Build Authority",
    engagement: "Increase Engagement", awareness: "Product Awareness", thought: "Thought Leadership",
  };
  const styleLabels: Record<string, string> = {
    story: "Storytelling", contrarian: "Contrarian", educational: "Educational", personal: "Personal Experience",
  };
  const toneLabels: Record<string, string> = {
    professional: "Professional", casual: "Casual", bold: "Bold", founder: "Founder-style",
  };

  const system = `You are an expert LinkedIn ghostwriter for founders and startup leaders.

Rules — strictly follow these:
- Never use "I'm excited to share" or "I'm thrilled to announce"
- Never use buzzwords: synergy, leverage, disrupt, paradigm shift, game-changer
- Never start with "In today's world" or "As a founder..."
- Write short paragraphs — max 2-3 lines each
- Use line breaks generously for readability
- First sentence must be a hook — bold claim, number, question, or provocative statement
- Sound like a real human, not a press release
- End with either a question that invites reply, or a strong takeaway line
- No hashtags. No emojis unless essential.
- Output ONLY the LinkedIn post text, nothing else.`;

  const patterns = extractPatterns(data.pastPosts);
  const historySection = patterns
    ? `Writing patterns from top-performing past posts: ${patterns}`
    : `No historical data — write like an experienced SaaS founder. Use first-person perspective, real numbers when possible, short paragraphs, and a hook-driven opening.`;

  const actionModifier = actionType === "shorter"
    ? "\n\nIMPORTANT: Make the post shorter — under 150 words. Cut fluff, keep punch."
    : actionType === "human"
    ? "\n\nIMPORTANT: Rewrite removing any phrase that sounds AI-generated. Make it feel like a real person wrote it on their phone."
    : actionType === "hook"
    ? "\n\nIMPORTANT: Rewrite only the opening 2 lines with a bolder, more attention-grabbing hook. Keep the rest."
    : "";

  const user = `Goal: ${goalLabels[data.goal || ""] || "Build Authority"}
Post Type: ${styleLabels[data.style || ""] || "Storytelling"}
Topic: ${data.topic || "AI-powered outbound sales"}
Tone: ${toneLabels[data.tone || ""] || "Founder-style"}
${data.performingTopics.length ? `Performing topics context: ${data.performingTopics.join(", ")}` : ""}
${data.context ? `Additional context: ${data.context}` : ""}
${historySection}

Now write the LinkedIn post.${actionModifier}`;

  return { system, user };
}

export default function SynQApp() {
  const [formData, setFormData] = useState<FormData>({
    goal: null,
    style: null,
    topic: "",
    tone: null,
    performingTopics: [],
    context: "",
    pastPosts: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [pastOpen, setPastOpen] = useState(false);
  const [status, setStatus] = useState<"empty" | "loading" | "ready">("empty");
  const [post, setPost] = useState("");
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const copyTimer = useRef<number | null>(null);

  // Load saved API key only on client (localStorage not available during SSR)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("gemini_key") : "";
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => () => { if (copyTimer.current) window.clearTimeout(copyTimer.current); }, []);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setFormData((p) => ({ ...p, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || formData.performingTopics.includes(t)) return;
    update("performingTopics", [...formData.performingTopics, t]);
    setTagInput("");
  };
  const removeTag = (t: string) =>
    update("performingTopics", formData.performingTopics.filter((x) => x !== t));

  const generatePost = async (type: "generate" | "regenerate" | "shorter" | "human" | "hook") => {
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      toast.error("Please enter your Gemini API key!");
      return;
    }

    if (typeof window !== "undefined") window.localStorage.setItem("gemini_key", apiKey);
    setStatus("loading");
    setErrorMsg("");

    try {
      const { system, user } = buildPrompt(formData, type === "regenerate" ? "generate" : type);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: user }] }],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 800,
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "API error");
      }

      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!generated) throw new Error("Empty response from Gemini");

      setPost(generated.trim());
      setStatus("ready");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setStatus("empty");
      toast.error(`Error: ${msg}`);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      toast.success("Post copied to clipboard! 🚀");
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Try again.");
    }
  };

  return (
    <div className="relative z-10 min-h-screen">
      <Header />

      {/* API Key Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mb-2">
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground flex-shrink-0">🔑 Gemini API Key</span>
          <input
            type={showKeyInput ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your Gemini API key here (free at aistudio.google.com)"
            className="flex-1 min-w-0 bg-transparent border-b border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 py-1"
          />
          <button
            onClick={() => setShowKeyInput((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            {showKeyInput ? "Hide" : "Show"}
          </button>
          {apiKey && (
            <span className="text-xs text-emerald-400 flex-shrink-0">✓ Key saved</span>
          )}
        </div>
        {errorMsg && (
          <p className="mt-2 text-xs text-rose-400 px-1">{errorMsg}</p>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-6">
          {/* LEFT */}
          <section className="glass rounded-3xl p-6 md:p-7">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-semibold">Craft Your Post</h2>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Goal */}
            <div className="mb-6">
              <SectionLabel>What's your goal?</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => update("goal", g.id)}
                    className={`pill ${formData.goal === g.id ? "pill-active" : ""}`}>
                    <span>{g.emoji}</span>{g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <SectionLabel>Post style</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => update("style", s.id)}
                    className={`pill ${formData.style === s.id ? "pill-active" : ""}`}>
                    <span>{s.emoji}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="mb-6">
              <SectionLabel>What do you want to write about?</SectionLabel>
              <input
                value={formData.topic}
                onChange={(e) => update("topic", e.target.value)}
                placeholder="e.g. Why cold outbound fails without warm intent"
                className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
              />
            </div>

            {/* Tone */}
            <div className="mb-6">
              <SectionLabel>Tone of voice</SectionLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {TONES.map((t) => {
                  const active = formData.tone === t.id;
                  return (
                    <button key={t.id} onClick={() => update("tone", t.id)}
                      className={`text-left rounded-xl p-3.5 transition-all duration-200 border ${
                        active
                          ? "bg-grad-primary border-transparent glow text-white"
                          : "glass hover:bg-white/[0.07] border-white/8"
                      }`}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>{t.emoji}</span>{t.label}
                      </div>
                      <div className={`text-xs mt-1 ${active ? "text-white/85" : "text-muted-foreground"}`}>
                        {t.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Performing topics */}
            <div className="mb-6">
              <SectionLabel hint="Optional">Topics that perform for you</SectionLabel>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Type a topic and press Enter..."
                className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
              />
              {formData.performingTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.performingTopics.map((t) => (
                    <span key={t} className="pill pill-active text-xs">
                      {t}
                      <button onClick={() => removeTag(t)} className="ml-1 opacity-80 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Context */}
            <div className="mb-6">
              <SectionLabel hint="Optional">Additional context</SectionLabel>
              <textarea
                value={formData.context}
                onChange={(e) => update("context", e.target.value)}
                rows={3}
                placeholder="Any specific angle, data points, or instructions..."
                className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70 resize-none"
              />
            </div>

            {/* Past posts */}
            <div className="mb-7">
              <button onClick={() => setPastOpen((v) => !v)}
                className="w-full flex items-center justify-between text-left glass rounded-xl px-4 py-3 hover:bg-white/[0.06] transition">
                <div>
                  <div className="text-sm font-medium">📊 Add historical posts for personalized style</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Paste your past posts with their performance data</div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 text-muted-foreground transition-transform ${pastOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {pastOpen && (
                <div className="mt-3 animate-fade-up">
                  <textarea
                    value={formData.pastPosts}
                    onChange={(e) => update("pastPosts", e.target.value)}
                    rows={5}
                    placeholder="Paste your LinkedIn posts here. Format: [POST TEXT] | Impressions: 10000 | Engagement: 5%"
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70 resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Add up to 10 posts. Higher performing posts will shape your writing style.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => generatePost("generate")}
              disabled={status === "loading"}
              className={`btn-primary w-full rounded-xl py-3.5 text-base font-semibold ${status !== "loading" ? "pulse-idle" : ""}`}
            >
              {status === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generating...
                </span>
              ) : (
                <>✨ Generate Post</>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">Powered by SynQ Intelligence</p>
          </section>

          {/* RIGHT */}
          <section className="glass rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
            <div className="flex-1">
              {status === "empty" && <EmptyState />}
              {status === "loading" && <LoadingState />}
              {status === "ready" && <PostPreview post={post} />}
            </div>

            {status === "ready" && (
              <div className="p-5 pt-0 animate-fade-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: "regenerate", label: "🔄 Regenerate" },
                    { id: "shorter", label: "✂️ Make Shorter" },
                    { id: "human", label: "🧑 More Human" },
                    { id: "hook", label: "🔥 Stronger Hook" },
                  ].map((b) => (
                    <button key={b.id}
                      onClick={() => generatePost(b.id as any)}
                      className="glass rounded-xl px-3 py-2.5 text-xs md:text-sm font-medium hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all">
                      {b.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-primary w-full rounded-xl py-3.5 text-base font-semibold inline-flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>✅ Copied!</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Copy Post
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}