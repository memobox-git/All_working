// Saves the public course data (published courses, their cohorts and weekly curriculum) to
// content/courses.snapshot.json. The build reads Supabase directly when the env vars are set and falls
// back to this file when they aren't. Run: npm run snapshot (needs .env.local).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)");

const get = async (path) => {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
};

const courses = await get(
  "courses?select=id,slug,title,description,category,price,duration_weeks,course_level,course_format,prerequisites,benefits,target_personas,thumbnail_url,social_share_image_url,is_hidden,status,course_weeks(week_number,title,description),course_cohorts(id,cohort_name,start_date,end_date,status,enrollment_cap,enrolled_count,teaching_days)&status=eq.published&is_hidden=eq.false",
);
const out = { savedAt: new Date().toISOString(), courses };
writeFileSync("content/courses.snapshot.json", JSON.stringify(out, null, 2) + "\n");
console.log(`saved ${courses.length} courses:`, courses.map((c) => `${c.slug} (${c.course_cohorts.length} cohorts, ${c.course_weeks.length} weeks)`).join(", "));
