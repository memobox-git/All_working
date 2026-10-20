import type { Metadata } from "next";
import raw from "@/content/resources/linkedin-bible.json";
import { ResourceHero, ResourceCta } from "@/components/resources/resource-shell";
import { Row } from "@/components/row";
import { ChapterIndex } from "@/components/resources/guides/chapter-index";
import { GuideChapter, slugify, type GuideChapterData, type GuideSection } from "@/components/resources/guides/linkedin-chapter";

export const metadata: Metadata = {
  title: "The LinkedIn Bible",
  description:
    "A free seven-chapter guide to LinkedIn: your profile, DMs, the job search, hiring, networking, comments and Sales Navigator, with copyable message templates.",
  alternates: { canonical: "/resources/linkedin-bible" },
};

// LinkedIn retired Creator Mode in 2024, so this checklist item no longer applies.
const RETIRED = new Set(["Creator mode ON (if you post content)"]);

const chapters: GuideChapterData[] = raw.chapters.map((c) => ({
  id: slugify(c.tabLabel),
  number: c.number,
  tabLabel: c.tabLabel,
  title: c.title,
  subtitle: c.subtitle,
  intro: c.intro,
  sections: (c.sections as GuideSection[]).map((s) => (s.body ? { ...s, body: s.body.filter((b) => !RETIRED.has(b)) } : s)),
}));

const all = chapters.flatMap((c) => c.sections);
const count = {
  sections: all.length,
  templates: all.reduce((n, s) => n + (s.templates?.length ?? 0), 0),
  tables: all.filter((s) => s.table).length,
};

export default function Page() {
  return (
    <>
      <ResourceHero
        category="Career"
        title={
          <>
            The LinkedIn <span className="t-pixel">Bible</span>
          </>
        }
        summary={raw.summary}
        meta={[
          { label: "Chapters", value: String(chapters.length) },
          { label: "Sections", value: String(count.sections) },
          { label: "Templates to copy", value: String(count.templates) },
          { label: "Tables", value: String(count.tables) },
        ]}
      />
      <Row n="03" id="guide">
        <div className="grid grid-cols-1 min-[1200px]:grid-cols-[264px_minmax(0,1fr)]">
          <ChapterIndex
            items={chapters.map((c) => ({ id: c.id, number: c.number, label: c.tabLabel, count: c.sections.length }))}
          />
          <div className="min-w-0 hairline min-[1200px]:border-l">
            {chapters.map((c) => (
              <GuideChapter key={c.id} chapter={c} />
            ))}
          </div>
        </div>
      </Row>
      <ResourceCta
        n="04"
        title="Turn your profile into more interviews."
        body="The Stackle resume and LinkedIn service rewrites both with you, so recruiters find you and your applications get answers."
        courseHref="/career"
        courseLabel="See the career service"
      />
    </>
  );
}
