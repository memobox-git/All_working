"use client";

import { useEffect, useState } from "react";
import { hasSupabase, rest } from "@/lib/supabase";
import { type Cohort, daysUntil, fmtDate, fmtDays, fmtRange, isUpcoming } from "@/lib/courses";

type Raw = { id: string; cohort_name: string; start_date: string; end_date: string; status: string; enrollment_cap: number | null; enrolled_count: number | null; teaching_days: string[] | null };

// Server-rendered cohorts, refreshed in the browser so a static page never shows a cohort that has
// already started or misses a new one.
export function useLiveCohorts(courseId: string, initial: Cohort[]) {
  const [cohorts, setCohorts] = useState(initial);
  useEffect(() => {
    let alive = true;
    setCohorts((c) => c.filter((k) => isUpcoming(k)));
    if (!hasSupabase) return;
    rest<Raw[]>(`course_cohorts?select=id,cohort_name,start_date,end_date,status,enrollment_cap,enrolled_count,teaching_days&course_id=eq.${courseId}&status=eq.upcoming&order=start_date.asc`)
      .then((rows) => {
        if (!alive) return;
        setCohorts(
          rows
            .map((k) => ({ id: k.id, name: k.cohort_name, start: k.start_date, end: k.end_date, status: k.status, cap: k.enrollment_cap, enrolled: k.enrolled_count, days: k.teaching_days ?? [] }))
            .filter((k) => isUpcoming(k)),
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [courseId]);
  return cohorts;
}

export function NextCohortLine({ courseId, initial }: { courseId: string; initial: Cohort[] }) {
  const cohorts = useLiveCohorts(courseId, initial);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const next = cohorts[0];
  if (!next) return <span>Next cohort to be announced</span>;
  const d = now === null ? -1 : daysUntil(next.start, now);
  return (
    <span>
      Next cohort {fmtDate(next.start)}
      {d >= 0 && d <= 14 ? ` · starts in ${d === 0 ? "less than a day" : `${d} day${d === 1 ? "" : "s"}`}` : ""}
    </span>
  );
}

export function CohortList({ courseId, initial, limit = 3 }: { courseId: string; initial: Cohort[]; limit?: number }) {
  const cohorts = useLiveCohorts(courseId, initial).slice(0, limit);
  if (!cohorts.length) return <p className="t-small">No cohort is scheduled right now.</p>;
  return (
    <ul className="border-t hairline">
      {cohorts.map((k, i) => (
        <li key={k.id} className="flex items-center justify-between gap-4 border-b hairline py-3">
          <span className="flex items-center gap-3">
            <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium">{fmtRange(k.start, k.end)}</span>
          </span>
          <span className="t-mono-sm text-muted">{fmtDays(k.days)}</span>
        </li>
      ))}
    </ul>
  );
}
