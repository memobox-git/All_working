"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "building" | "done" | "error";
type StyleKey = "auto" | "editorial" | "bold" | "minimal" | "dark";
type Profile = {
  name?: string;
  role?: string;
  direction?: string;
  palette?: string[];
  fonts?: string[];
  highlights?: string[];
};
type Step = { label: string; state: "active" | "done" };
type Input = { file: File | null; text: string; style: StyleKey; notes: string; demo: boolean };

const STYLE_OPTIONS: { key: StyleKey; label: string }[] = [
  { key: "auto", label: "Let Claude decide" },
  { key: "editorial", label: "Editorial" },
  { key: "bold", label: "Bold" },
  { key: "minimal", label: "Minimal" },
  { key: "dark", label: "Dark studio" },
];

const PROFILE_RE = /<!--@profile\s+([\s\S]*?)-->/;
const STEP_RE = /<!--@step\s+([^>]*?)-->/g;

export default function Studio() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState<Input>({ file: null, text: "", style: "auto", notes: "", demo: false });
  const [pasteMode, setPasteMode] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [thinking, setThinking] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [doneMs, setDoneMs] = useState<number | null>(null);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [publish, setPublish] = useState<{ busy: boolean; url?: string; error?: string }>({ busy: false });
  const [showReady, setShowReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const htmlRef = useRef("");
  const pendingRef = useRef("");
  const followRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const docOpenRef = useRef(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);

  // Elapsed timer while building
  useEffect(() => {
    if (phase !== "building") return;
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Frame loop: flush streamed HTML into the live iframe and follow the build with the scroll position
  useEffect(() => {
    if (phase !== "building") return;
    let raf = 0;
    const tick = () => {
      const frame = iframeRef.current;
      const doc = frame?.contentDocument;
      const win = frame?.contentWindow;
      if (doc && win && pendingRef.current) {
        if (!docOpenRef.current) {
          doc.open();
          docOpenRef.current = true;
          followRef.current = true;
          const stopFollowing = () => (followRef.current = false);
          win.addEventListener("wheel", stopFollowing, { passive: true });
          win.addEventListener("touchmove", stopFollowing, { passive: true });
        }
        doc.write(pendingRef.current);
        pendingRef.current = "";
      }
      if (doc?.body && win && followRef.current) {
        const target = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight);
        const y = win.scrollY + (target - win.scrollY) * 0.12;
        win.scrollTo(0, y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (codeRef.current) codeRef.current.scrollTop = codeRef.current.scrollHeight;
  }, [html, view]);
  useEffect(() => {
    if (thinkingRef.current) thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
  }, [thinking]);

  const resetBuild = () => {
    htmlRef.current = "";
    pendingRef.current = "";
    docOpenRef.current = false;
    setThinking("");
    setProfile(null);
    setSteps([]);
    setHtml("");
    setError(null);
    setElapsed(0);
    setDoneMs(null);
    setPublish({ busy: false });
    setShowReady(false);
    setMode(null);
    setView("preview");
  };

  const onHtml = useCallback((chunk: string) => {
    htmlRef.current += chunk;
    pendingRef.current += chunk;
    const all = htmlRef.current;
    setHtml(all);

    if (!profileSeen.current) {
      const m = all.match(PROFILE_RE);
      if (m) {
        profileSeen.current = true;
        try {
          setProfile(JSON.parse(m[1]));
        } catch {
          setProfile({});
        }
      }
    }
    const labels: string[] = [];
    if (/<style/i.test(all)) labels.push("Type, color & layout system");
    for (const m of all.matchAll(STEP_RE)) labels.push(m[1].trim());
    if (labels.length !== stepCount.current) {
      stepCount.current = labels.length;
      setSteps(labels.map((label, i) => ({ label, state: i === labels.length - 1 ? "active" : "done" })));
    }
  }, []);
  const profileSeen = useRef(false);
  const stepCount = useRef(0);

  const finish = (ms: number) => {
    const frame = iframeRef.current;
    if (pendingRef.current && frame?.contentDocument) {
      frame.contentDocument.write(pendingRef.current);
      pendingRef.current = "";
    }
    frame?.contentDocument?.close();
    setSteps((s) => s.map((x) => ({ ...x, state: "done" })));
    setDoneMs(ms);
    setPhase("done");
    setShowReady(true);
    setTimeout(() => frame?.contentWindow?.scrollTo({ top: 0, behavior: "smooth" }), 350);
  };

  const build = async (override?: Partial<Input>) => {
    const req = { ...input, ...override };
    setInput(req);
    resetBuild();
    profileSeen.current = false;
    stepCount.current = 0;
    setPhase("building");

    const fd = new FormData();
    if (req.file) fd.append("file", req.file);
    if (req.text) fd.append("text", req.text);
    fd.append("style", req.style);
    fd.append("notes", req.notes);
    if (req.demo) fd.append("demo", "1");

    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/build", { method: "POST", body: fd, signal: ac.signal });
      if (!res.body) throw new Error("The server didn't start a build. Try again.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let finished = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const e = JSON.parse(line);
          if (e.type === "mode") setMode(e.mode);
          else if (e.type === "thinking") setThinking((t) => t + e.text);
          else if (e.type === "html") onHtml(e.text);
          else if (e.type === "done") {
            finished = true;
            finish(e.ms);
          } else if (e.type === "error") {
            finished = true;
            setError(e.message);
            setPhase("error");
          }
        }
      }
      if (!finished) {
        setError("The connection closed before the build finished. Try again.");
        setPhase("error");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Couldn't reach the build server. Check your connection and try again.");
      setPhase("error");
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setError("Build stopped.");
    setPhase("error");
  };

  const cleanHtml = () =>
    htmlRef.current.replace(PROFILE_RE, "").replace(STEP_RE, "").replace(/^\s+/, "");

  const download = () => {
    const blob = new Blob([cleanHtml()], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug(profile?.name) || "portfolio"}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const openTab = () => {
    const url = URL.createObjectURL(new Blob([cleanHtml()], { type: "text/html" }));
    window.open(url, "_blank", "noopener");
  };

  const doPublish = async () => {
    setPublish({ busy: true });
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: cleanHtml(), name: profile?.name }),
      });
      const data = await res.json();
      setPublish(res.ok ? { busy: false, url: data.url } : { busy: false, error: data.error });
    } catch {
      setPublish({ busy: false, error: "Publishing failed. Check your connection and try again." });
    }
  };

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setInput((i) => ({ ...i, file: f, text: "", demo: false }));
  };

  const canBuild = Boolean(input.file || input.text.trim().length > 80);

  // ---------- Landing ----------
  if (phase === "idle") {
    return (
      <main className="landing">
        <header className="brand">
          <span className="logo" aria-hidden="true" />
          Folio Studio
        </header>
        <section className="intro">
          <p className="kicker">Resume in, website out</p>
          <h1>
            Drop a resume.
            <br />
            <em>Watch the portfolio build itself.</em>
          </h1>
          <p className="sub">
            Claude reads the resume, picks a visual direction for that person, and writes the site live, section by
            section, in front of you. Ready to download or publish in about a minute.
          </p>
        </section>

        <section className="composer" aria-label="Start a build">
          {!pasteMode ? (
            <label
              className={`drop ${dragging ? "is-drag" : ""} ${input.file ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onFiles(e.dataTransfer.files);
              }}
            >
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.txt,.md,application/pdf"
                onChange={(e) => onFiles(e.target.files)}
              />
              <span className="drop-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
                </svg>
              </span>
              {input.file ? (
                <span>
                  <strong>{input.file.name}</strong>
                  <small>{Math.round(input.file.size / 1024)} KB · click to replace</small>
                </span>
              ) : (
                <span>
                  <strong>Drop the resume here, or click to choose</strong>
                  <small>PDF, DOCX or TXT</small>
                </span>
              )}
            </label>
          ) : (
            <textarea
              id="resume-text"
              className="paste"
              placeholder="Paste the full resume text here…"
              value={input.text}
              onChange={(e) => setInput((i) => ({ ...i, text: e.target.value, file: null, demo: false }))}
            />
          )}

          <button type="button" className="link" onClick={() => setPasteMode((p) => !p)}>
            {pasteMode ? "Upload a file instead" : "Paste text instead"}
          </button>

          <fieldset className="styles">
            <legend>Style</legend>
            {STYLE_OPTIONS.map((s) => (
              <button
                type="button"
                key={s.key}
                className={`chip ${input.style === s.key ? "on" : ""}`}
                aria-pressed={input.style === s.key}
                onClick={() => setInput((i) => ({ ...i, style: s.key }))}
              >
                {s.label}
              </button>
            ))}
          </fieldset>

          <input
            id="notes"
            className="notes"
            placeholder="Anything to emphasize? e.g. “targeting staff roles at fintechs”"
            value={input.notes}
            onChange={(e) => setInput((i) => ({ ...i, notes: e.target.value }))}
          />

          <div className="go-row">
            <button type="button" className="go" disabled={!canBuild} onClick={() => build()}>
              Build portfolio
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="link" onClick={() => build({ demo: true })}>
              Watch a sample build
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Studio ----------
  const building = phase === "building";
  const lines = html ? html.split("\n").length : 0;
  const status = building
    ? html
      ? "Building"
      : thinking
        ? "Planning the design"
        : "Reading resume"
    : phase === "done"
      ? `Built in ${fmt(doneMs ?? elapsed)}`
      : "Stopped";

  return (
    <main className="studio">
      <header className="bar">
        <div className="bar-left">
          <button type="button" className="brand small" onClick={() => setPhase("idle")} title="Start over">
            <span className="logo" aria-hidden="true" />
            Folio Studio
          </button>
          <span className={`status ${phase}`}>
            <i aria-hidden="true" />
            {status}
            {building && <b>{fmt(elapsed)}</b>}
          </span>
          {mode === "demo" && <span className="demo-tag">Sample build</span>}
        </div>
        <div className="bar-mid" role="group" aria-label="View">
          <button type="button" className={view === "preview" ? "on" : ""} onClick={() => setView("preview")}>
            Preview
          </button>
          <button type="button" className={view === "code" ? "on" : ""} onClick={() => setView("code")}>
            Code
          </button>
          <span className="sep" />
          <button
            type="button"
            className={device === "desktop" ? "on" : ""}
            onClick={() => setDevice("desktop")}
            aria-label="Desktop width"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg>
          </button>
          <button
            type="button"
            className={device === "mobile" ? "on" : ""}
            onClick={() => setDevice("mobile")}
            aria-label="Phone width"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></svg>
          </button>
        </div>
        <div className="bar-right">
          {building ? (
            <button type="button" className="ghost" onClick={stop}>
              Stop
            </button>
          ) : (
            <>
              <button type="button" className="ghost" onClick={() => build()} disabled={!canBuild && !input.demo}>
                Rebuild
              </button>
              {phase === "done" && (
                <>
                  <button type="button" className="ghost" onClick={openTab}>
                    Open
                  </button>
                  <button type="button" className="ghost" onClick={download}>
                    Download
                  </button>
                  <button type="button" className="primary" onClick={doPublish} disabled={publish.busy}>
                    {publish.busy ? "Publishing…" : "Publish"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </header>

      <aside className="feed" aria-label="Build activity">
        <FeedItem state={thinking || html || error ? "done" : building ? "active" : "idle"} title="Reading the resume">
          <span className="muted">{input.file?.name ?? (input.text ? "Pasted text" : "Sample resume")}</span>
        </FeedItem>

        {(thinking || (building && !html)) && (
          <FeedItem state={html ? "done" : "active"} title="Planning the design">
            <div className="thinking" ref={thinkingRef}>
              {thinking || <span className="muted">Thinking…</span>}
            </div>
          </FeedItem>
        )}

        {profile && (
          <FeedItem state="done" title="Design direction">
            <div className="profile">
              {profile.name && <strong className="pname">{profile.name}</strong>}
              {profile.role && <span className="muted">{profile.role}</span>}
              {profile.direction && <p>{profile.direction}</p>}
              {!!profile.palette?.length && (
                <div className="swatches">
                  {profile.palette.slice(0, 6).map((c, i) => (
                    <span key={c + i} style={{ background: c, animationDelay: `${i * 90}ms` }} title={c} />
                  ))}
                </div>
              )}
              {!!profile.fonts?.length && (
                <div className="fonts">
                  {profile.fonts.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              )}
              {!!profile.highlights?.length && (
                <div className="tags">
                  {profile.highlights.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              )}
            </div>
          </FeedItem>
        )}

        {steps.length > 0 && (
          <FeedItem state={phase === "done" ? "done" : "active"} title="Building the page">
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s.label + i} className={building ? s.state : "done"}>
                  <i aria-hidden="true" />
                  {s.label}
                </li>
              ))}
            </ol>
            <span className="muted mono">
              {lines} lines · {(html.length / 1024).toFixed(1)} KB written
            </span>
          </FeedItem>
        )}

        {phase === "done" && (
          <FeedItem state="done" title="Ready">
            <span className="muted">Download it, open it full screen, or publish it to a live link.</span>
            {publish.url && (
              <p className="published">
                Live at{" "}
                <a href={publish.url} target="_blank" rel="noopener noreferrer">
                  {publish.url.replace(/^https?:\/\//, "")}
                </a>
                . Connect the person&apos;s own domain from the site&apos;s Netlify settings.
              </p>
            )}
            {publish.error && <p className="err">{publish.error}</p>}
          </FeedItem>
        )}

        {error && (
          <FeedItem state="error" title="Build didn't finish">
            <p className="err">{error}</p>
          </FeedItem>
        )}
      </aside>

      <section className="stage" aria-label="Live preview">
        <div className={`browser ${device}`}>
          <div className="chrome">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="url">{slug(profile?.name) || "your-portfolio"}.folio.site</span>
          </div>
          <div className="viewport">
            <iframe ref={iframeRef} title="Portfolio preview" className={view === "preview" ? "" : "hidden"} />
            {view === "code" && (
              <pre className="code" ref={codeRef}>
                <code dangerouslySetInnerHTML={{ __html: highlight(html.slice(-14000)) }} />
                {building && <span className="caret" />}
              </pre>
            )}
            {view === "preview" && !/<body/i.test(html) && phase !== "error" && (
              <div className="skeleton" aria-hidden="true">
                <span className="sk w60" />
                <span className="sk w40" />
                <span className="sk block" />
                <span className="sk w80" />
                <span className="sk w70" />
                <p>{html ? "Writing the type, color and layout system…" : thinking ? "Choosing a visual direction…" : "Reading the resume…"}</p>
              </div>
            )}
            {building && html && view === "preview" && <div className="scan" aria-hidden="true" />}
          </div>
        </div>
        {showReady && (
          <div className="ready" role="status">
            <strong>{profile?.name ? `${profile.name}'s portfolio is ready` : "The portfolio is ready"}</strong>
            <span>Built live in {fmt(doneMs ?? 0)}</span>
            <button type="button" onClick={() => setShowReady(false)} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function FeedItem({
  state,
  title,
  children,
}: {
  state: "idle" | "active" | "done" | "error";
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`item ${state}`}>
      <span className="marker" aria-hidden="true" />
      <div className="item-body">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function slug(s?: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function highlight(src: string) {
  const esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(
    /(&lt;!--[\s\S]*?(?:--&gt;|$))|(&lt;\/?)([a-zA-Z][\w-]*)|([\w-]+)=("[^"]*")/g,
    (_m, comment, open, tag, attr, val) => {
      if (comment) return `<span class="c">${comment}</span>`;
      if (tag) return `${open}<span class="t">${tag}</span>`;
      return `<span class="a">${attr}</span>=<span class="s">${val}</span>`;
    },
  );
}
