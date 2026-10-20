"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { ArrowRight } from "@/components/icons";

// Live medallion pipeline: fetches 6 real products from DummyJSON, then lets the reader step through
// API → Bronze → Silver → Gold → Consumers. Every number is computed in the browser from that response.

type Product = {
  id: number;
  title?: string;
  price?: number;
  category?: string;
  brand?: string;
  stock?: number;
  rating?: number;
  discountPercentage?: number;
  [k: string]: unknown;
};
type Bronze = { _ingested_at: string; _source: string; raw: Product };
type Silver = {
  product_id: string;
  product_name: string;
  price_usd: number;
  category: string;
  brand: string;
  stock_qty: number;
  rating: number;
  discount_pct: number;
  ingested_at: string;
};
type StockStatus = "healthy" | "low" | "critical";
type PriceTier = "premium" | "mid" | "budget";
type Gold = Silver & { revenue_potential: number; stock_status: StockStatus; price_tier: PriceTier };
type Run = { url: string; ms: number; at: Date; bronze: Bronze[]; silver: Silver[]; gold: Gold[] };

const STAGES = ["api", "bronze", "silver", "gold", "consumers"] as const;
type Stage = (typeof STAGES)[number];
const CHIP: Record<Stage, string> = { api: "API", bronze: "Bronze", silver: "Silver", gold: "Gold", consumers: "Consumers" };
const NEXT_LABEL: Partial<Record<Stage, string>> = { bronze: "Next: Silver layer", silver: "Next: Gold layer", gold: "Next: Consumer views" };

const r2 = (x: number) => Math.round(x * 100) / 100;
const r1 = (x: number) => Math.round(x * 10) / 10;
const usd = (x: number, d = 2) => "$" + x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function toSilver(b: Bronze): Silver {
  const p = b.raw;
  return {
    product_id: "prod_" + String(p.id).padStart(4, "0"),
    product_name: (typeof p.title === "string" ? p.title.trim() : "") || "UNKNOWN",
    price_usd: typeof p.price === "number" ? r2(p.price) : 0,
    category: typeof p.category === "string" && p.category ? p.category.toLowerCase().replace(/-/g, " ") : "uncategorized",
    brand: typeof p.brand === "string" && p.brand ? p.brand : "UNKNOWN",
    stock_qty: Math.max(0, Math.round(typeof p.stock === "number" ? p.stock : 0)),
    rating: r1(typeof p.rating === "number" ? p.rating : 0),
    discount_pct: r2(typeof p.discountPercentage === "number" ? p.discountPercentage : 0),
    ingested_at: b._ingested_at,
  };
}

function toGold(s: Silver): Gold {
  return {
    ...s,
    revenue_potential: r2(s.price_usd * s.stock_qty),
    stock_status: s.stock_qty > 50 ? "healthy" : s.stock_qty > 10 ? "low" : "critical",
    price_tier: s.price_usd > 100 ? "premium" : s.price_usd > 30 ? "mid" : "budget",
  };
}

export type PipelineDemoText = {
  start: string;
  loading: string;
  rerun: string;
  idleText: string;
  idleNote: string;
  stages: Record<Stage, { title: string; subtitle: string; footnote?: string }>;
  analystCode: string;
  scientistCode: string;
  closing: { strong: string; text: string };
};

export function PipelineDemo({ text }: { text: PipelineDemoText }) {
  const [stage, setStage] = useState<Stage | "idle">("idle");
  const [loading, setLoading] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const focusNext = useRef<Stage | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const s = focusNext.current;
    if (!s || stage !== s) return;
    focusNext.current = null;
    const el = document.getElementById(`pipe-${s}`);
    el?.focus({ preventScroll: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }, [stage]);

  const start = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = window.setTimeout(() => ctrl.abort(), 12000);
    const skip = Math.floor(Math.random() * 80);
    const url = `https://dummyjson.com/products?limit=6&skip=${skip}`;
    setError(null);
    setRun(null);
    setPending(url);
    setLoading(true);
    setStage("api");
    const t0 = performance.now();
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json: unknown = await res.json();
      const products = (json as { products?: unknown }).products;
      if (!Array.isArray(products) || products.length === 0) throw new Error("The API returned no products");
      const at = new Date();
      const bronze: Bronze[] = (products as Product[]).map((raw) => ({ _ingested_at: at.toISOString(), _source: "dummyjson.com/products", raw }));
      const silver = bronze.map(toSilver);
      const gold = silver.map(toGold);
      setRun({ url, ms: Math.round(performance.now() - t0), at, bronze, silver, gold });
      focusNext.current = "bronze";
      setStage("bronze");
    } catch (e) {
      if (ctrl.signal.aborted && abortRef.current !== ctrl) return; // superseded by a newer run
      const msg = ctrl.signal.aborted ? "The request timed out" : e instanceof Error && e.message ? e.message : "Failed to fetch data";
      setError(msg === "Failed to fetch" ? "Failed to fetch data" : msg);
      setStage("idle");
    } finally {
      window.clearTimeout(timer);
      if (abortRef.current === ctrl) setLoading(false);
    }
  }, []);

  const advance = () => {
    const i = STAGES.indexOf(stage as Stage);
    const nxt = STAGES[i + 1];
    if (!nxt) return;
    focusNext.current = nxt;
    setStage(nxt);
  };

  const idx = stage === "idle" ? -1 : STAGES.indexOf(stage);
  const shown = (s: Stage) => idx >= STAGES.indexOf(s) && (s === "api" || run !== null);
  const status =
    stage === "idle"
      ? error
        ? `Error: ${error}`
        : ""
      : loading
        ? "Fetching products from DummyJSON"
        : `${CHIP[stage]} stage shown`;


  return (
    <div className="space-y-4">
      {/* controls + quiet stage progress */}
      <div className="panel flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:gap-10 md:px-7 md:py-6">
        <div className="min-w-0 flex-1 md:max-w-[640px]">
          <ol className="grid grid-cols-5 gap-1.5 sm:gap-2" aria-label="Pipeline stages">
            {STAGES.map((s, i) => {
              const state = idx === i ? "current" : idx > i ? "done" : "todo";
              return (
                <li key={s} className="min-w-0">
                  <span aria-hidden="true" className={`block h-1 rounded-full transition-colors duration-300 ${state === "todo" ? "bg-line" : "bg-ink"}`} />
                  <span
                    aria-current={state === "current" ? "step" : undefined}
                    className={`sr-only text-[13.5px] sm:not-sr-only sm:mt-2.5 sm:block sm:truncate ${
                      state === "current" ? "font-semibold text-ink" : state === "done" ? "text-ink-2" : "text-muted"
                    }`}
                  >
                    {CHIP[s]}
                    {state === "done" && <span className="sr-only"> (done)</span>}
                  </span>
                </li>
              );
            })}
          </ol>
          {idx >= 0 && (
            <p aria-hidden="true" className="mt-2.5 text-[13.5px] text-muted sm:hidden">
              Step {idx + 1} of {STAGES.length} · <span className="font-semibold text-ink">{CHIP[STAGES[idx]]}</span>
            </p>
          )}
        </div>
        <button type="button" className="btn btn-ink btn-chrome shrink-0 self-start md:self-auto" onClick={start} disabled={loading}>
          {loading ? text.loading : stage === "idle" ? text.start : text.rerun}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      {stage === "idle" && (
        <div className="panel px-5 py-12 text-center md:px-8 md:py-16">
          {error ? (
            <div role="alert" className="mx-auto max-w-[460px] rounded-[12px] border border-line-strong bg-paper px-5 py-5 text-left">
              <p className="text-[14px] font-semibold">Pipeline stopped</p>
              <p className="mt-2 font-semibold">{error}</p>
              <p className="t-small mt-1">DummyJSON may be down or blocked on this network. Try again in a moment.</p>
              <button type="button" className="btn btn-line btn-chrome mt-4" onClick={start}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <p className="t-serif mx-auto max-w-[520px] text-[22px] leading-snug tracking-[-0.01em] md:text-[24px]">{text.idleText}</p>
              <p className="t-small mt-3">{text.idleNote}</p>
            </>
          )}
        </div>
      )}

      {shown("api") && (
        <Panel stage="api" title={text.stages.api.title} subtitle={pending ?? text.stages.api.subtitle} count={run ? `${run.bronze.length} products · ${run.ms} ms` : undefined}>
          {loading || !run ? (
            <p className="flex items-center gap-2.5 text-[14px] text-muted">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-line-strong border-t-ink [animation-duration:1.1s]" aria-hidden="true" /> Awaiting API
              response...
            </p>
          ) : (
            <p className="flex flex-wrap items-center gap-2 text-[14px] text-muted">
              <span className="rounded-full bg-fill px-2.5 py-1 text-[12.5px] font-semibold leading-none text-ink">200 OK</span>
              response field: <code className="font-mono text-[13px] text-ink-2">products</code>
            </p>
          )}
        </Panel>
      )}

      {run && shown("bronze") && (
        <Panel stage="bronze" title={text.stages.bronze.title} subtitle={text.stages.bronze.subtitle} table="bronze.raw_products" count={`${run.bronze.length} records ingested`}>
          <CodeBlock
            className="[&_pre]:max-h-[340px] [&_pre]:overflow-y-auto"
            language="json"
            filename="bronze.raw_products"
            code={JSON.stringify(run.bronze.slice(0, 3), null, 2) + (run.bronze.length > 3 ? `\n// ... ${run.bronze.length - 3} more records` : "")}
          />
        </Panel>
      )}

      {run && shown("silver") && (
        <Panel stage="silver" title={text.stages.silver.title} subtitle={text.stages.silver.subtitle} table="silver.products" count={`${run.silver.length} clean records`} footnote={text.stages.silver.footnote}>
          <DataTable
            columns={["product_id", "product_name", "price_usd", "category", "brand", "stock", "rating"]}
            rows={run.silver.map((s) => [s.product_id, s.product_name, usd(s.price_usd), s.category, s.brand, String(s.stock_qty), s.rating.toFixed(1)])}
          />
        </Panel>
      )}

      {run && shown("gold") && (
        <Panel stage="gold" title={text.stages.gold.title} subtitle={text.stages.gold.subtitle} table="gold.products" count={`${run.gold.length} enriched records`} footnote={text.stages.gold.footnote}>
          <DataTable
            columns={["product_id", "name", "price", "category", "revenue_pot", "stock_status", "price_tier"]}
            rows={run.gold.map((g) => [
              g.product_id,
              g.product_name,
              usd(g.price_usd),
              g.category,
              usd(g.revenue_potential, 0),
              <Badge key="s" kind={g.stock_status} />,
              <Badge key="t" kind={g.price_tier} />,
            ])}
          />
        </Panel>
      )}

      {run && shown("consumers") && (
        <Panel stage="consumers" title={text.stages.consumers.title} subtitle={text.stages.consumers.subtitle}>
          <Consumers run={run} text={text} />
          <p className="mt-5 rounded-[12px] bg-fill px-5 py-4 text-[16.5px] leading-[1.55]">
            <strong className="font-semibold">{text.closing.strong}</strong> <span className="text-ink-2">{text.closing.text}</span>
          </p>
        </Panel>
      )}

      {run && stage !== "idle" && NEXT_LABEL[stage] && (
        <div className="flex justify-end pt-2">
          <button type="button" className="btn btn-ink btn-chrome" onClick={advance}>
            {NEXT_LABEL[stage]} <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

function Panel({
  stage,
  title,
  subtitle,
  table,
  count,
  footnote,
  children,
}: {
  stage: Stage;
  title: string;
  subtitle: string;
  table?: string;
  count?: string;
  footnote?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`pipe-${stage}`} className="panel min-w-0 p-5 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[14px] text-muted">
            <span className="t-serif text-[15px]">{String(STAGES.indexOf(stage) + 1).padStart(2, "0")}</span>
            <span>{CHIP[stage]}</span>
            {table && <code className="rounded-md bg-fill px-1.5 py-0.5 font-mono text-[12px] text-ink-2">{table}</code>}
          </p>
          <h3 id={`pipe-${stage}`} tabIndex={-1} className="t-h4 mt-2.5 outline-none">
            {title}
          </h3>
          <p className="t-small mt-1 break-words">{subtitle}</p>
        </div>
        {count && <p className="shrink-0 self-start rounded-full bg-fill px-3 py-1.5 text-[13px] font-medium leading-none text-ink">{count}</p>}
      </div>
      <div className="mt-5">{children}</div>
      {footnote && <p className="t-small mt-3 text-[13.5px]">{footnote.replace(/\s•\s/g, " · ")}</p>}
    </section>
  );
}

function DataTable({ columns, rows, dense = false }: { columns: string[]; rows: ReactNode[][]; dense?: boolean }) {
  return (
    <div className="scroll-x rounded-[12px] border border-line bg-white">
      <table className={`w-full border-collapse tabular-nums ${dense ? "text-[13px]" : "text-[13.5px]"} leading-[1.4]`}>
        <thead>
          <tr className="border-b hairline bg-paper">
            {columns.map((c) => (
              <th key={c} scope="col" className="whitespace-nowrap px-3 py-2.5 text-left font-mono text-[12px] font-normal text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b hairline last:border-b-0">
              {r.map((c, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Monochrome status pills: ink fill, soft fill and outline instead of colour.
function Badge({ kind }: { kind: StockStatus | PriceTier }) {
  const cls: Record<StockStatus | PriceTier, string> = {
    healthy: "border-line-strong bg-white text-ink",
    low: "border-transparent bg-fill-2 text-ink",
    critical: "border-ink bg-ink text-paper",
    premium: "border-ink bg-ink text-paper",
    mid: "border-line-strong bg-white text-ink",
    budget: "border-line bg-white text-muted",
  };
  return <span className={`inline-block rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none ${cls[kind]}`}>{kind}</span>;
}

function Consumers({ run, text }: { run: Run; text: PipelineDemoText }) {
  const gold = run.gold;
  // Analyst: category report.
  const byCat = new Map<string, { n: number; price: number; pot: number }>();
  for (const g of gold) {
    const c = byCat.get(g.category) ?? { n: 0, price: 0, pot: 0 };
    c.n++;
    c.price += g.price_usd;
    c.pot += g.revenue_potential;
    byCat.set(g.category, c);
  }
  const cats = [...byCat.entries()].map(([category, c]) => ({ category, n: c.n, avg: c.price / c.n, pot: c.pot }));
  // Scientist: features (median threshold, as the code says).
  const med = median(gold.map((g) => g.revenue_potential));
  // Executive.
  const total = gold.reduce((a, g) => a + g.revenue_potential, 0);
  const avgPrice = gold.reduce((a, g) => a + g.price_usd, 0) / gold.length;
  const critical = gold.filter((g) => g.stock_status === "critical").length;
  const low = gold.filter((g) => g.stock_status === "low").length;
  const healthy = gold.length - critical - low;
  const avgRating = gold.reduce((a, g) => a + g.rating, 0) / gold.length;
  const maxCat = Math.max(...cats.map((c) => c.pot), 1);
  const maxRev = Math.max(...gold.map((g) => g.revenue_potential), 1);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <View role="Data Analyst" subtitle="Category performance report" badge="SQL">
        <CodeBlock code={text.analystCode} language="sql" filename="analyst.sql" />
        <div className="mt-3">
          <DataTable
            dense
            columns={["category", "#", "avg $", "potential"]}
            rows={cats.map((c) => [c.category, String(c.n), usd(c.avg), usd(c.pot, 0)])}
          />
        </div>
      </View>
      <View role="Data Scientist" subtitle="Feature engineering for an ML model" badge="Python">
        <CodeBlock code={text.scientistCode} language="python" filename="features.py" />
        <div className="mt-3">
          <DataTable
            dense
            columns={["id", "price", "rating", "hi_val", "disc"]}
            rows={gold.slice(0, 4).map((g) => [
              g.product_id,
              usd(g.price_usd),
              g.rating.toFixed(1),
              <Bit key="h" on={g.revenue_potential > med} />,
              <Bit key="d" on={g.discount_pct > 10} />,
            ])}
          />
        </div>
      </View>
      <div className="min-w-0 rounded-[14px] border border-line bg-paper p-4 md:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h4 className="font-semibold">Business executive dashboard</h4>
          <p className="text-[13.5px] text-muted">Product analytics · powered by gold.products</p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: "Total revenue potential", v: usd(total, 0) },
            { k: "Products in catalog", v: String(gold.length) },
            { k: "Avg price point", v: usd(avgPrice) },
            { k: "Critical stock alerts", v: String(critical), note: critical > 0 ? "Action needed" : "All clear" },
          ].map((m) => (
            <div key={m.k} className="flex min-w-0 flex-col rounded-[12px] border border-line bg-white px-4 py-4">
              <dt className="order-2 mt-2 text-[13px] leading-snug text-muted">{m.k}</dt>
              <dd className="t-serif order-1 text-[26px] leading-none tracking-[-0.02em] md:text-[30px]">{m.v}</dd>
              {m.note && <dd className="order-3 mt-1.5 text-[12.5px] font-semibold text-ink">{m.note}</dd>}
            </div>
          ))}
        </dl>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Chart title="Revenue by category">
            <ul className="space-y-3">
              {cats.map((c) => (
                <li key={c.category}>
                  <div className="flex justify-between gap-3 text-[13px]">
                    <span className="truncate">{c.category}</span>
                    <span className="tabular-nums text-muted">{usd(c.pot, 0)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fill">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${(c.pot / maxCat) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Chart>
          <Chart title="Inventory health">
            <div className="flex h-3 gap-[3px] overflow-hidden rounded-full" role="img" aria-label={`${healthy} healthy, ${low} low, ${critical} critical`}>
              {healthy > 0 && <div className="h-full rounded-full bg-ink" style={{ width: `${(healthy / gold.length) * 100}%` }} />}
              {low > 0 && <div className="h-full rounded-full bg-faint" style={{ width: `${(low / gold.length) * 100}%` }} />}
              {critical > 0 && <div className="h-full rounded-full bg-line-strong" style={{ width: `${(critical / gold.length) * 100}%` }} />}
            </div>
            <ul className="mt-4 space-y-2 text-[13px]">
              {[
                { k: "Healthy", v: healthy, sw: "bg-ink" },
                { k: "Low", v: low, sw: "bg-faint" },
                { k: "Critical", v: critical, sw: "bg-line-strong" },
              ]
                .filter((x) => x.v > 0)
                .map((x) => (
                  <li key={x.k} className="flex items-center gap-2">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${x.sw}`} />
                    <span className="flex-1">{x.k}</span>
                    <span className="tabular-nums text-muted">{x.v}</span>
                  </li>
                ))}
            </ul>
          </Chart>
          <Chart title="Price vs revenue">
            <AreaChart values={gold.map((g) => g.revenue_potential)} labels={gold.map((g) => g.product_name.slice(0, 15))} max={maxRev} />
          </Chart>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
          <span>Avg rating: {avgRating.toFixed(1)} / 5</span>
          <span>
            Healthy stock: {healthy}/{gold.length}
          </span>
          <span>Last refresh: {run.at.toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
}

function View({ role, subtitle, badge, children }: { role: string; subtitle: string; badge: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-[14px] border border-line bg-paper p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{role}</h4>
          <p className="t-small">{subtitle}</p>
        </div>
        <span className="rounded-full border border-line-strong bg-white px-2.5 py-1 text-[12.5px] font-semibold leading-none">{badge}</span>
      </div>
      {children}
    </div>
  );
}

function Bit({ on }: { on: boolean }) {
  return <span className={`inline-grid h-6 min-w-6 place-items-center rounded-md px-1 ${on ? "bg-ink text-paper" : "text-muted"}`}>{on ? 1 : 0}</span>;
}

function Chart({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="min-w-0 rounded-[12px] border border-line bg-white p-4">
      <figcaption className="mb-4 text-[13.5px] font-semibold">{title}</figcaption>
      {children}
    </figure>
  );
}

function AreaChart({ values, labels, max }: { values: number[]; labels: string[]; max: number }) {
  const w = 300;
  const h = 120;
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => [i * step, h - (v / max) * (h - 8)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block h-[120px] w-full" role="img" aria-label="Revenue potential per product">
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="rgb(21 21 19 / 0.07)" />
        <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="mt-3 space-y-1 text-[12.5px]">
        {labels.map((l, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span className="truncate">
              <span className="t-serif text-muted">{String(i + 1).padStart(2, "0")}</span> {l}
            </span>
            <span className="tabular-nums text-muted">{usd(values[i], 0)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
