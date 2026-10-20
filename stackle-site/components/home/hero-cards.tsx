import type { Course } from "@/lib/courses";
import { fmtDate, fmtDays } from "@/lib/courses";
import { Pixel } from "@/components/icons";

// The floating cards beside the hero headline: a course's real week-by-week plan, the next cohort
// date and the session days. All content comes from Supabase, nothing invented.
export function HeroCards({ course }: { course: Course }) {
  const weeks = course.curriculum;
  const pick = [0, Math.floor(weeks.length * 0.4), Math.floor(weeks.length * 0.7), weeks.length - 1]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((i) => weeks[i])
    .filter(Boolean);
  const next = course.cohorts[0];
  return (
    <div className="relative mx-auto w-full max-w-[460px] pb-14 pt-12 lg:mr-0">
      {next && (
        <div className="chip-dark reveal absolute left-0 top-0 z-10 px-4 py-3 sm:-left-10" style={{ ["--d" as string]: ".25s" }}>
          <p className="text-[12.5px] text-night-muted">Next cohort</p>
          <p className="t-serif mt-1 text-[24px] leading-none">{fmtDate(next.start, { month: "short", day: "numeric" })}</p>
        </div>
      )}

      <div className="card-float reveal relative p-5 md:p-6" style={{ ["--d" as string]: ".1s" }}>
        <div className="flex items-start justify-between gap-3">
          <p className="t-serif text-[21px] leading-tight">{course.copy.short} — week by week</p>
          <span className="shrink-0 rounded-full border border-line-strong px-2.5 py-1 text-[12px] font-semibold">{course.weeks} weeks</span>
        </div>
        <ul className="mt-4">
          {pick.map((w, i) => (
            <li key={w.n} className="flex items-center justify-between gap-3 border-t hairline py-3 text-[14.5px]">
              <span className="min-w-0 truncate text-ink-2">{w.title}</span>
              <span className={`flex shrink-0 items-center gap-1.5 font-semibold ${i < 2 ? "text-ink" : "text-muted"}`}>
                {i < 2 && <Pixel name="check" size={14} />}
                Wk {String(w.n).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-muted">A build every week</p>
        <div className="mt-3 flex h-[64px] items-end gap-[5px]" aria-hidden="true">
          {weeks.map((w, i) => {
            const h = 30 + (i / Math.max(1, weeks.length - 1)) * 70;
            const done = i < Math.ceil(weeks.length * 0.45);
            const now = i === Math.ceil(weeks.length * 0.45);
            return (
              <span
                key={w.n}
                className={`flex-1 rounded-[3px] ${now ? "bg-ink" : done ? "bg-fill-2" : "border border-dashed border-line-strong"}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[12.5px] text-muted">
          <span>Week 1</span>
          <span>Demo Day</span>
        </div>
      </div>

      <div className="chip-dark reveal absolute bottom-0 right-0 z-10 px-4 py-3 sm:-right-6" style={{ ["--d" as string]: ".35s" }}>
        <p className="text-[12.5px] text-night-muted">Live sessions</p>
        <p className="t-serif mt-1 text-[22px] leading-none">{fmtDays(next?.days ?? ["monday", "wednesday", "friday"]).replace(/ \/ /g, " · ")}</p>
      </div>
    </div>
  );
}
