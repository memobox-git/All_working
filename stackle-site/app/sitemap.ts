import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/courses";
import { resources } from "@/content/resources";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const courses = await getCourses();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    page("/courses", 0.9, "weekly"),
    ...courses.map((c) => page(`/courses/${c.slug}`, 0.9, "weekly")),
    page("/career", 0.8),
    page("/resources", 0.8, "weekly"),
    ...resources.map((r) => page(`/resources/${r.slug}`, 0.7)),
    page("/terms", 0.2, "yearly"),
    page("/privacy-policy", 0.2, "yearly"),
  ];
}
