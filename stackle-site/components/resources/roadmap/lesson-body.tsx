import type { ReactNode } from "react";
import { ArrowUpRight, Pixel } from "@/components/icons";
import type { Lesson } from "./data";
import { ExampleView } from "./example";
import { Checklist, SectionNav } from "./lesson-drawer";
import styles from "./roadmap.module.css";

// One lesson, rendered on the server. It lives in the page HTML (inside the hidden drawer) so search engines
// and Ctrl+F see every lesson; the drawer only toggles which one is visible.

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function SectionTitle({ id, n, children, aside }: { id: string; n: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h3 id={id} className="flex items-baseline gap-3 text-[19px] font-medium tracking-[-0.015em]">
        <span className="t-mono-sm text-muted">{n}</span>
        {children}
      </h3>
      {aside}
    </div>
  );
}

export function LessonBody({ lesson, footnote }: { lesson: Lesson; footnote: string }) {
  const id = lesson.id;
  const sections = [
    { key: "overview", label: "Overview" },
    { key: "checklist", label: "Checklist" },
    ...(lesson.resources.length ? [{ key: "resources", label: "Resources" }] : []),
    ...(lesson.videos.length ? [{ key: "videos", label: "Videos" }] : []),
    ...(lesson.example ? [{ key: "example", label: "Example" }] : []),
  ];
  let k = 0;
  const num = () => String(++k).padStart(2, "0");

  return (
    <article aria-labelledby={`lesson-${id}-title`} className="pb-16">
      <header id={`lesson-${id}-overview`} tabIndex={-1} className="scroll-mt-4 px-5 pb-8 pt-8 outline-none md:px-8 md:pt-10">
        <p className="t-mono-sm text-muted">{lesson.category}</p>
        <h2 id={`lesson-${id}-title`} tabIndex={-1} className="t-h3 mt-3 outline-none">
          {lesson.title}
        </h2>
        <p className="t-body mt-4 text-[17px]">{lesson.overview}</p>
      </header>

      <SectionNav id={id} sections={sections} />

      <div className="space-y-12 px-5 pt-10 md:px-8">
        <section id={`lesson-${id}-checklist`} tabIndex={-1} aria-labelledby={`lesson-${id}-checklist-h`} className="scroll-mt-16 outline-none">
          <SectionTitle id={`lesson-${id}-checklist-h`} n={num()}>
            Checklist
          </SectionTitle>
          <div className="mt-4">
            <Checklist id={id} items={lesson.checklist} />
          </div>
        </section>

        {lesson.resources.length > 0 && (
          <section id={`lesson-${id}-resources`} tabIndex={-1} aria-labelledby={`lesson-${id}-resources-h`} className="scroll-mt-16 outline-none">
            <SectionTitle id={`lesson-${id}-resources-h`} n={num()}>
              Free resources
            </SectionTitle>
            <ul className="mt-4 border-t border-line">
              {lesson.resources.map((r) => (
                <li key={r.url + r.label}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <span>
                      <b>{r.label}</b>
                      <small>
                        {r.kind ? `${r.kind.replace(/-/g, " ")} · ` : ""}
                        {host(r.url)}
                      </small>
                    </span>
                    <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.videos.length > 0 && (
          <section id={`lesson-${id}-videos`} tabIndex={-1} aria-labelledby={`lesson-${id}-videos-h`} className="scroll-mt-16 outline-none">
            <SectionTitle id={`lesson-${id}-videos-h`} n={num()}>
              Videos
            </SectionTitle>
            <ul className="mt-4 border-t border-line">
              {lesson.videos.map((v) => (
                <li key={v.url}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <Pixel name="play" size={10} />
                    <span>
                      <b>{v.title}</b>
                      <small>YouTube</small>
                    </span>
                    <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.example && (
          <section id={`lesson-${id}-example`} tabIndex={-1} aria-labelledby={`lesson-${id}-example-h`} className="scroll-mt-16 outline-none">
            <SectionTitle id={`lesson-${id}-example-h`} n={num()}>
              Example
            </SectionTitle>
            <p className="mt-2 text-[15px] text-ink-2">{lesson.example.title}</p>
            <div className="mt-4">
              <ExampleView example={lesson.example} />
            </div>
            <p className="t-small mt-3">{footnote}</p>
          </section>
        )}
      </div>
    </article>
  );
}
