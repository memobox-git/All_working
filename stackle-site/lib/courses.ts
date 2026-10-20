import snapshot from "@/content/courses.snapshot.json";
import { courseCopy, courseOrder, type CourseCopy } from "@/content/courses";
import { hasSupabase, rest } from "./supabase";

export type Cohort = {
  id: string;
  name: string;
  start: string; // ISO
  end: string;
  status: string;
  cap: number | null;
  enrolled: number | null;
  days: string[];
};

export type Week = { n: number; title: string; points: string[] };

export type Course = {
  id: string;
  slug: string;
  price: number;
  weeks: number;
  level: string;
  format: string;
  description: string;
  prerequisites: string[];
  forWho: string[];
  benefits: string[];
  curriculum: Week[];
  cohorts: Cohort[]; // upcoming only, soonest first
  image: string | null;
  copy: CourseCopy;
};

type Row = (typeof snapshot.courses)[number];

const bullets = (s: string | null | undefined) =>
  (s ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[•\-*]\s*/, "").trim())
    .filter(Boolean);

export const isUpcoming = (c: { status: string; start: string }, now = Date.now()) =>
  c.status === "upcoming" && new Date(c.start).getTime() + 24 * 3600 * 1000 > now;

export function toCohorts(rows: Row["course_cohorts"]): Cohort[] {
  return rows
    .map((k) => ({
      id: k.id,
      name: k.cohort_name,
      start: k.start_date,
      end: k.end_date,
      status: k.status,
      cap: k.enrollment_cap,
      enrolled: k.enrolled_count,
      days: (k.teaching_days ?? []) as string[],
    }))
    .filter((k) => isUpcoming(k))
    .sort((a, b) => a.start.localeCompare(b.start));
}

function shape(r: Row): Course | null {
  const copy = courseCopy[r.slug];
  if (!copy) return null;
  return {
    id: r.id,
    slug: r.slug,
    price: r.price,
    weeks: r.duration_weeks,
    level: r.course_level ?? "",
    format: r.course_format ?? "cohort",
    description: r.description ?? "",
    prerequisites: copy.prerequisites ?? bullets(r.prerequisites),
    forWho: copy.forWho ?? ((r.target_personas ?? []) as { description: string }[]).map((p) => p.description),
    benefits: (r.benefits ?? []) as string[],
    curriculum: [...(r.course_weeks ?? [])]
      .sort((a, b) => a.week_number - b.week_number)
      .map((w) => ({ n: w.week_number, title: w.title.trim().replace(/,(?=\S)/g, ", "), points: bullets(w.description) })),
    cohorts: toCohorts(r.course_cohorts ?? []),
    image: r.thumbnail_url ?? null,
    copy,
  };
}

let cache: Promise<Course[]> | null = null;

// All courses we have copy for, in Academy order. Reads Supabase at build time when configured,
// otherwise the committed snapshot.
export function getCourses(): Promise<Course[]> {
  cache ??= (async () => {
    let rows: Row[] = snapshot.courses as Row[];
    if (hasSupabase) {
      try {
        rows = await rest<Row[]>(
          "courses?select=id,slug,title,description,category,price,duration_weeks,course_level,course_format,prerequisites,benefits,target_personas,thumbnail_url,social_share_image_url,is_hidden,status,course_weeks(week_number,title,description),course_cohorts(id,cohort_name,start_date,end_date,status,enrollment_cap,enrolled_count,teaching_days)&status=eq.published&is_hidden=eq.false",
        );
      } catch (e) {
        console.warn("[courses] Supabase read failed, using snapshot:", (e as Error).message);
      }
    }
    return courseOrder.map((slug) => rows.find((r) => r.slug === slug)).filter((r): r is Row => Boolean(r)).map(shape).filter((c): c is Course => Boolean(c));
  })();
  return cache;
}

export async function getCourse(slug: string) {
  return (await getCourses()).find((c) => c.slug === slug) ?? null;
}

// ---- formatting ----
const tz = "UTC"; // cohort dates are stored as midnight UTC dates
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-US", { ...opts, timeZone: tz }).format(new Date(iso));
export const fmtRange = (a: string, b: string) => `${fmtDate(a, { month: "short", day: "numeric" })} – ${fmtDate(b)}`;
export const fmtPrice = (n: number) => `$${n.toLocaleString("en-US")}`;
export const fmtDays = (days: string[]) =>
  days.length ? days.map((d) => d.slice(0, 3).replace(/^./, (c) => c.toUpperCase())).join(" / ") : "Weekly";
export const daysUntil = (iso: string, now = Date.now()) => Math.ceil((new Date(iso).getTime() - now) / 86400000);
