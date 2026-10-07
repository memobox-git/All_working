import { createHash } from "node:crypto";

export const runtime = "nodejs";

const API = "https://api.netlify.com/api/v1";

/** Deploys the generated portfolio as a new Netlify site and returns its live URL. */
export async function POST(req: Request) {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!token) {
    return Response.json(
      { error: "Publishing isn't set up yet. Add NETLIFY_AUTH_TOKEN to the server environment, or download the HTML instead." },
      { status: 501 },
    );
  }

  const { html, name } = (await req.json()) as { html?: string; name?: string };
  if (!html || html.length < 200) return Response.json({ error: "There's no finished portfolio to publish yet." }, { status: 400 });

  const auth = { Authorization: `Bearer ${token}` };
  const slug = `${(name || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const site = await call(`${API}/sites`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ name: slug }) });
    const sha = createHash("sha1").update(html).digest("hex");
    const deploy = await call(`${API}/sites/${site.id}/deploys`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ files: { "/index.html": sha } }),
    });
    if ((deploy.required ?? []).includes(sha)) {
      await call(`${API}/deploys/${deploy.id}/files/index.html`, {
        method: "PUT",
        headers: { ...auth, "Content-Type": "application/octet-stream" },
        body: html,
      });
    }
    return Response.json({ url: site.ssl_url || site.url, adminUrl: site.admin_url });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Publishing failed." }, { status: 502 });
  }
}

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Netlify returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
