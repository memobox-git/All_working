import type { Metadata } from "next";
import raw from "@/content/resources/python-for-de-deck.json";
import { ResourceHero, ResourceCta } from "@/components/resources/resource-shell";
import { DeckViewer, type DeckPart, type DeckSlideMeta } from "@/components/resources/guides/deck-viewer";
import { DeckSlide, type DeckRawSlide } from "@/components/resources/guides/deck-slides";

export const metadata: Metadata = {
  title: "Python for Data Engineering: slides",
  description: raw.seo.description,
  alternates: { canonical: "/resources/python-for-de-deck" },
};

type SidebarItem = { label: string; slide: number; codeTab?: string };
type SidebarEntry = { label: string; number?: string; slide?: number; items?: SidebarItem[] };
type RawPart = { id: string; title: string; sidebar: SidebarEntry[]; slides: DeckRawSlide[] };

const rawParts = raw.parts as unknown as RawPart[];

// The old sidebar listed topics that have no slide (Section 07 "Comprehensions"; Section 09 "Order Validator"
// and "Revenue Tracker"). Leave them out of the outline. The Snowflake/pandas links are already corrected in
// the JSON (`slide` is the intended target, `originalNavSlide` the old one).
const NO_SLIDE = new Set(["Comprehensions", "Order Validator", "Revenue Tracker"]);

const KIND: Record<DeckRawSlide["type"], string> = {
  cover: "Cover",
  section: "Divider",
  code: "Code",
  content: "Notes",
  pipeline: "Diagram",
};

const parts: DeckPart[] = [];
const slides: DeckSlideMeta[] = [];
const flat: { slide: DeckRawSlide; part: number }[] = [];

rawParts.forEach((p, pi) => {
  parts.push({ title: p.title, start: flat.length, count: p.slides.length });
  p.slides.forEach((s) => {
    flat.push({ slide: s, part: pi });
    // Outline sub-links: the sidebar items that point at this slide. An item without a code tab on a code
    // slide opens its first tab (the old deck left the tab unchanged).
    const items = p.sidebar
      .flatMap((e) => e.items ?? [])
      .filter((it) => it.slide === s.number && !NO_SLIDE.has(it.label))
      .map((it) => ({ label: it.label, tab: s.type === "code" ? (it.codeTab ?? s.tabs?.[0]?.id) : undefined }));
    const title =
      s.type === "code" ? (s.heading?.split(" — ")[1] ?? s.heading ?? "") : (s.title ?? "");
    const context = s.type === "code" ? s.sidebarTitle : s.type === "cover" ? `Part ${pi + 1}` : s.eyebrow?.split(" · ")[0];
    slides.push({ part: pi, title, kind: [context, KIND[s.type]].filter(Boolean).join(" · "), items });
  });
});

const codeSamples = flat.reduce(
  (n, { slide }) =>
    n +
    (slide.tabs?.length ?? 0) +
    (slide.blocks ?? []).reduce(
      (m, b) => m + (b.items ?? []).reduce((k, it) => k + (it.type === "code" ? 1 : 0) + (it.items ?? []).filter((x) => x.type === "code").length, 0),
      0,
    ),
  0,
);

export default function Page() {
  return (
    <>
      <ResourceHero
        category="Slides"
        title="Python for"
        second="Data Engineering"
        summary={raw.summary}
        meta={[
          { label: "Parts", value: String(parts.length) },
          { label: "Slides", value: String(flat.length) },
          { label: "Code samples", value: String(codeSamples) },
          { label: "End-to-end pipelines", value: "2" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href="#deck" className="btn btn-ink">
            Start the deck
          </a>
          {parts.map((p, i) => (
            <a key={p.title} href={`#slide-${p.start + 1}`} className="btn btn-line btn-chrome">
              Part {i + 1}
            </a>
          ))}
        </div>
      </ResourceHero>
      <DeckViewer
        brand={raw.layout.brand}
        label={raw.title}
        parts={parts}
        slides={slides}
        nodes={flat.map(({ slide, part }, i) => (
          <DeckSlide key={i} slide={slide} index={i} part={part} />
        ))}
      />
      <ResourceCta
        title="Write this code live, with feedback."
        body="This deck comes from the Stackle Data Engineering Masterclass: ten weeks of live sessions on SQL, Python, data modeling, Spark, Kafka, Airflow and the cloud, where you build end-to-end pipelines and present them at Demo Day."
        courseHref="/courses/data-engineering-masterclass-get-job-ready-in-10-weeks"
        courseLabel="See the DE Masterclass"
      />
    </>
  );
}
