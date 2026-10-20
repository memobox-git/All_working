import type { ReactNode } from "react";

// Inline Markdown subset used by the course JSON: **bold**, *em*, `code`, [label](url) and backslash
// escapes such as \[ \] \_ \*. Anything that does not close is kept as literal text.

const ESCAPABLE = "\\`*_[]()#+-.!";

function findClose(s: string, token: string, from: number): number {
  for (let j = from; j <= s.length - token.length; j++) {
    if (s[j] === "\\") {
      j++;
      continue;
    }
    if (s.startsWith(token, j)) {
      if (token === "*" && s[j + 1] === "*") {
        j++;
        continue;
      }
      return j;
    }
  }
  return -1;
}

function parse(s: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let k = 0;
  let i = 0;
  const flush = () => {
    if (buf) out.push(buf);
    buf = "";
  };
  while (i < s.length) {
    const c = s[i];
    if (c === "\\" && i + 1 < s.length && ESCAPABLE.includes(s[i + 1])) {
      buf += s[i + 1];
      i += 2;
      continue;
    }
    if (c === "`") {
      const j = s.indexOf("`", i + 1);
      if (j > i + 1) {
        flush();
        out.push(<code key={`${key}c${k++}`}>{s.slice(i + 1, j)}</code>);
        i = j + 1;
        continue;
      }
    }
    if (c === "*" && s[i + 1] === "*") {
      const j = findClose(s, "**", i + 2);
      if (j > i + 2) {
        flush();
        const kk = `${key}b${k++}`;
        out.push(<strong key={kk}>{parse(s.slice(i + 2, j), kk)}</strong>);
        i = j + 2;
        continue;
      }
    }
    if (c === "*" && s[i + 1] !== "*" && s[i + 1] !== " ") {
      const j = findClose(s, "*", i + 1);
      if (j > i + 1) {
        flush();
        const kk = `${key}e${k++}`;
        out.push(<em key={kk}>{parse(s.slice(i + 1, j), kk)}</em>);
        i = j + 1;
        continue;
      }
    }
    if (c === "[") {
      const m = /^\[((?:\\.|[^\]\\])*)\]\(([^)\s]+)\)/.exec(s.slice(i));
      if (m) {
        flush();
        const kk = `${key}a${k++}`;
        const external = /^https?:/.test(m[2]);
        out.push(
          <a key={kk} href={m[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {parse(m[1], kk)}
          </a>,
        );
        i += m[0].length;
        continue;
      }
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}

export function Inline({ text }: { text: string }) {
  return <>{parse(text, "i")}</>;
}

// The cheat sheet's answers are tiny HTML fragments that only use <strong>, <em>, <br> and a few
// entities. Turn them into React elements instead of injecting HTML.
const ENTITIES: Record<string, string> = { gt: ">", lt: "<", amp: "&", quot: '"', "#39": "'", nbsp: " " };
const decode = (s: string) => s.replace(/&(gt|lt|amp|quot|#39|nbsp);/g, (_, e: string) => ENTITIES[e]);

export function RichHtml({ html }: { html: string }) {
  type Frame = { tag: "root" | "strong" | "em"; children: ReactNode[] };
  const stack: Frame[] = [{ tag: "root", children: [] }];
  let k = 0;
  const close = () => {
    const f = stack.pop()!;
    const El = f.tag as "strong" | "em";
    stack[stack.length - 1].children.push(<El key={k++}>{f.children}</El>);
  };
  for (const t of html.split(/(<\/?(?:strong|em)>|<br\s*\/?>)/g)) {
    if (!t) continue;
    const top = stack[stack.length - 1];
    if (/^<br/.test(t)) top.children.push(<br key={k++} />);
    else if (t === "<strong>" || t === "<em>") stack.push({ tag: t.slice(1, -1) as "strong" | "em", children: [] });
    else if (t === "</strong>" || t === "</em>") {
      if (stack.length > 1) close();
    } else top.children.push(decode(t));
  }
  while (stack.length > 1) close();
  return <>{stack[0].children}</>;
}
